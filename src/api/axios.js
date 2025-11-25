import axios from "axios";

let baseURL = null;

if (process.env.NODE_ENV === "development") {
  baseURL = "http://localhost:8000";
} else {
  baseURL = "https://petopia-backend-chi.vercel.app/";
}

const instance = axios.create({
  baseURL: baseURL,
});

export default instance;
