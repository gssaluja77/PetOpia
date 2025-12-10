import axios from "axios";

let baseURL = null;

if (process.env.NODE_ENV === "development") {
  baseURL = "http://localhost:8000";
} else {
  baseURL = "https://petopia-backend-chi.vercel.app";
}

const instance = axios.create({
  baseURL: baseURL,
});

// Add session ID to request headers. The purpose of interceptors is to modify the request before it is sent to the server.
instance.interceptors.request.use(
  (config) => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      const parsedSessionId = JSON.parse(sessionId);
      config.headers.Authorization = parsedSessionId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)
// Handle authentication errors (401) by logging out user. The purpose of interceptors is to modify the response before it is received from the server.
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("sessionId");
      localStorage.removeItem("userId");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("username");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("loginTime");
      localStorage.removeItem("lastActivity");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
)

export default instance;
