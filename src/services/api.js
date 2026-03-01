import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
export const API_PATH = import.meta.env.VITE_API_PATH;

export const api = axios.create({
  baseURL: API_BASE
})

export const adminApi = axios.create({
  baseURL: API_BASE,
})
//攔截器
adminApi.interceptors.request.use(
  (config) => {
    //先取得token
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexTokenAPI="))
      ?.split("=")[1];
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
)