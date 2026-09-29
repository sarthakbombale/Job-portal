const LRU = require('lru-cache');

// In-memory LRU cache with 100 items max, 10 min TTL
const memoryCache = new LRU({
  max: 100,
  ttl: 1000 * 60 * 10, // 10 minutes
  updateAgeOnGet: true
});

/**
 * Simple memoization function for expensive computations
 * @param {string} key - Cache key
 * @param {Function} fn - Async function to memoize
 * @param {number} ttl - Time to live in milliseconds (default: 5 mins)
 */
async function memoize(key, fn, ttl = 1000 * 60 * 5) {
  const cached = memoryCache.get(key);
  if (cached) {
    return cached;
  }
  
  const result = await fn();
  memoryCache.set(key, result, { ttl });
  return result;
}

/**
 * Set cache value
 */
function setCache(key, value, ttl = 1000 * 60 * 5) {
  memoryCache.set(key, value, { ttl });
}

/**
 * Get cache value
 */
function getCache(key) {
  return memoryCache.get(key);
}

/**
 * Clear cache by pattern or all
 */
function clearCache(pattern = null) {
  if (!pattern) {
    memoryCache.clear();
    return;
  }
  
  const keys = Array.from(memoryCache.keys());
  keys.forEach(key => {
    if (key.includes(pattern)) {
      memoryCache.delete(key);
    }
  });
}

module.exports = {
  memoize,
  setCache,
  getCache,
  clearCache,
  memoryCache
};
