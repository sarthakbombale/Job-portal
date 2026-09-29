const { getCache, setCache, clearCache } = require('../utils/cache');

/**
 * Cache middleware - stores GET request responses
 * @param {number} ttl - Time to live in milliseconds (default: 5 mins)
 */
function cacheMiddleware(ttl = 1000 * 60 * 5) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create cache key from URL and user (if authenticated)
    const userId = req.user ? req.user.id : 'anonymous';
    const cacheKey = `${userId}:${req.originalUrl}`;

    // Check if data exists in cache
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      res.set('X-Cache', 'HIT');
      return res.json(cachedData);
    }

    // Store original res.json
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = function(data) {
      setCache(cacheKey, data, ttl);
      res.set('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
}

/**
 * Clear cache for specific patterns
 * Useful when data is modified
 */
function invalidateCache(pattern = null) {
  clearCache(pattern);
}

module.exports = {
  cacheMiddleware,
  invalidateCache
};
