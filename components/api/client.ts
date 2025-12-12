// lib/apiClient.ts
import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: process.env.API_BASE_URL ?? "https://app.myflexihr.com/api",
});

api.interceptors.request.use((config) => {
  let token = Cookies.get("auth_token");
  if (!token && typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("auth");
      if (raw) token = JSON.parse(raw)?.token;
    } catch {}
  }
  if (token) {
    config.headers = config.headers ;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
