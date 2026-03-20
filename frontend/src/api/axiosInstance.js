import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export const useAxios = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const instance = axios.create({
    baseURL: "http://localhost:5000"
  });

  instance.interceptors.request.use(
    async (config) => {
      console.log("➡️ INTERCEPTOR RUNNING");

      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: "https://misiones-api"
            }
          });

          console.log("✅ TOKEN:", token);

          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.error("❌ Error getting token:", error);
        }
      } else {
        console.warn("⚠️ User NOT authenticated");
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};