import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Response interceptor to handle global network dropouts
API.interceptors.response.use(
  (response) => {
    // If the request is successful, just pass the response through
    return response;
  },
  (error) => {
    // Check if the error is due to a complete network failure (backend down or no internet)
    if (!error.response || error.code === "ERR_NETWORK") {
      // Dispatches a global window event that App.jsx listens to for the Fallback UI
      window.dispatchEvent(new Event("apiNetworkError"));
    }
    
    // Pass the error handle back to the calling component so local try/catch blocks still work
    return Promise.reject(error);
  }
);

export default API;