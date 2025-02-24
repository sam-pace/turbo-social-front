import { useState, useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { LOGIN_MUTATION } from "graphql/mutations";
import { useRouter } from "expo-router";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const effectRan = useRef(false); // Prevents repeated effect execution

  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const checkTokenValidity = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      console.warn("Access Token:", accessToken);

      if (!accessToken) {
        console.warn("No access token found.");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error accessing SecureStore:", error);
      return false;
    }
  };

  const refreshSession = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      console.warn("Refresh Token:", refreshToken);

      if (!refreshToken) {
        console.warn("No refresh token found.");
        return false;
      }

      const response = await loginMutation({
        variables: { userLogin: { refreshToken } },
      });

      if (!response.data || !response.data.login) {
        console.warn("API response error, no login data.");
        return false;
      }

      const { accessToken, refreshToken: newRefreshToken } =
        response.data.login;

      if (!accessToken || !newRefreshToken) {
        console.warn("Undefined or empty tokens.");
        return false;
      }

      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", newRefreshToken);

      console.warn("Session successfully renewed.");
      return true;
    } catch (error) {
      console.error("Error renewing session:", error);
      return false;
    }
  };

  useEffect(() => {
    if (effectRan.current) return; // Prevents repeated execution
    effectRan.current = true;

    const checkAuth = async () => {
      console.warn("Checking authentication...");
      const isTokenValid = await checkTokenValidity();

      if (isTokenValid) {
        setIsAuthenticated(true);
      } else {
        console.warn("Invalid token. Attempting to renew session...");
        const success = await refreshSession();
        setIsAuthenticated(success);
        if (!success) {
          console.warn("Session not renewed, redirecting...");
          // setTimeout(() => router.push("/"), 500);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const loginUser = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      console.warn("response login", username, password);
      const response = await loginMutation({
        variables: { userLogin: { username, password } },
      });
      if (!response.data?.login) return false;

      const { accessToken, refreshToken } = response.data.login;
      if (!accessToken || !refreshToken) return false;

      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);

      setIsAuthenticated(true);
      setTimeout(() => router.push("/(tabs)/home"), 500);
      return true;
    } catch (error) {
      console.error("Error logging in:", error);
      setIsAuthenticated(false);
      setTimeout(() => router.push("/"), 500);
      return false;
    }
  };

  const logoutUser = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    setIsAuthenticated(false);
    setTimeout(() => router.push("/"), 500);
  };

  return { isAuthenticated, loading, loginUser, logoutUser };
};
