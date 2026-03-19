import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export const useAxios = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const instance = axios.create({
    baseURL: "http://localhost:5000"
  });

  instance.interceptors.request.use(
    async (config) => {

      if (isAuthenticated) {
        const token = await getAccessTokenSilently();

        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};