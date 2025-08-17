import axios from "axios";
import { useEffect } from "react";
import { api } from "../api";
import useAuth from "./useAuth";

export default function useAxios() {
  const { auth, setAuth } = useAuth();
  const instance = api();
  useEffect(() => {
    // add a request interceptor
    const requestInterceptor = instance.interceptors.request.use(
      (config) => {
        const { authToken } = auth;
        if (authToken) {
          config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // add a response interceptor
    const responseInterceptor = instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const { refreshToken } = auth;
            const response = await axios.post(
              `${import.meta.env.VITE_SERVER_BASE_URL}/auth/refresh-token`,
              {
                refreshToken,
              }
            );
            const { token } = response.data;
            setAuth({ ...auth, authToken: token });
            originalRequest.headers.Authorization = `Bearer ${token}`;
          } catch (err) {
            console.error("Token refresh failed:", err);
            throw err;
          }
        }
        return Promise.reject(error);
      }
    );

    // cleanup function
    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
  }, [auth.authToken]);

  return { instance };
}
