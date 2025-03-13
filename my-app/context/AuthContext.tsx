import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import * as SecureStore from "expo-secure-store";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION, REFRESH_TOKEN } from "graphql/mutations";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  loginUser: (username: string, password: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  accessToken: string | null;
  userId: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const effectRan = useRef(false);

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN);

  const checkTokenValidity = async () => {
    try {
      let token = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (!token || !refreshToken) {
        console.warn("Nenhum token encontrado.");
        await logoutUser();
        return false;
      }

      // Decodifica o access token para verificar validade
      const decodedToken = jwtDecode<{ exp: number }>(token);
      const now = Date.now() / 1000;

      if (decodedToken.exp < now) {
        console.warn("Access token expirado. Tentando renovar...");

        try {
          const response = await refreshTokenMutation({
            variables: { refreshToken },
          });

          if (!response.data?.refreshToken) {
            throw new Error("Nenhum refresh token retornado da API.");
          }

          const newAccessToken = response.data.refreshToken;
          await SecureStore.setItemAsync("accessToken", newAccessToken);
          setAccessToken(newAccessToken);
          return true;
        } catch (error: any) {
          console.warn("Erro ao renovar sessão:", error);

          if (
            error?.graphQLErrors?.[0]?.extensions?.code === "UNAUTHENTICATED"
          ) {
            console.warn(
              "Refresh token inválido ou expirado. Deslogando usuário..."
            );
            await logoutUser();
          }

          return false;
        }
      }

      setAccessToken(token);
      return true;
    } catch (error) {
      console.warn("Erro ao verificar validade do token:", error);
      return false;
    }
  };

  const loginUser = async (username: string, password: string) => {
    try {
      const response = await loginMutation({
        variables: { userLogin: { username, password } },
      });

      if (!response.data?.login) return false;

      const { accessToken, refreshToken } = response.data.login;
      if (!accessToken || !refreshToken) return false;

      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);
      setAccessToken(accessToken);
      setIsAuthenticated(true);

      setTimeout(() => router.push("/(tabs)/home"), 500);
      return true;
    } catch (error) {
      console.warn("Erro ao fazer login:", error);
      setIsAuthenticated(false);
      setTimeout(() => router.push("/"), 500);
      return false;
    }
  };

  const logoutUser = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    setAccessToken(null);
    setIsAuthenticated(false);
    setTimeout(() => router.push("/"), 500);
  };

  useEffect(() => {
    const checkAuth = async () => {
      console.warn("Verificando autenticação...");
      const isTokenValid = await checkTokenValidity();

      if (isTokenValid) {
        console.warn("Usuário autenticado!");
        setIsAuthenticated(true);
      } else {
        console.warn("Token inválido ou expirado.");
        setIsAuthenticated(false);
        setTimeout(() => router.push("/"), 500);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (accessToken) {
      const decodedToken = jwtDecode<{ sub: string }>(accessToken);
      setUserId(decodedToken.sub ?? null);
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        loginUser,
        logoutUser,
        accessToken,
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
