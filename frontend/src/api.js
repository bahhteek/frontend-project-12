import axios from "axios";
import { getAuth } from "./auth";

const api = axios.create({
  baseURL: "/",
});

api.interceptors.request.use((config) => {
  const auth = getAuth();
  if (auth?.token) config.headers.Authorization = `Bearer ${auth.token}`;
  return config;
});

export default api;
