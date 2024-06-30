import axios from "axios";

declare global {
  interface Window {
    csrf_token: string;
  }
}

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL ?? ""}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const csrfToken = window.csrf_token;
  if (csrfToken) {
    config.headers["X-Frappe-CSRF-Token"] = csrfToken;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      //   removeToken();
      //   window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
