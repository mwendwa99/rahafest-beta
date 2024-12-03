import React, { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authInstance } from "@/services/api.service";
import { Alert } from "react-native";

interface LoginResponse {
  status: string;
  message: string;
  data: {
    token: string;
    roles: number[];
  };
}

interface User {
  roles: number[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const TOKEN_KEY = "token";
const USER_KEY = "user";

const AuthContext = createContext<AuthContextType | null>(null);

function showError(message: string) {
  Alert.alert("Login Failed", message, [{ text: "OK", onPress: () => {} }]);
}

// Helper to handle various error scenarios with user-friendly messages
function getErrorMessage(error: any): string {
  // Network error
  if (!error.response) {
    return "Unable to connect to server. Please check your internet connection.";
  }

  // Server errors
  switch (error.response.status) {
    case 400:
      return "Invalid email or password. Please check your credentials.";
    case 401:
      return "Invalid email or password. Please check your credentials.";
    case 403:
      return "Your account doesn't have permission to access this feature.";
    case 404:
      return "Login service not available. Please try again later.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return "Something went wrong. Please try again later.";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const navigate = useCallback(
    (path: string) => {
      if (!isLoading) {
        router.replace(path);
      }
    },
    [isLoading, router]
  );

  const login = useCallback(
    async (data: { email: string; password: string }) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        // console.log(email, password);
        const response = await authInstance.post<LoginResponse>("/login", data);

        // console.log({ response });

        const { token, roles } = response.data.data;

        // Store authentication data
        await AsyncStorage.setItem(TOKEN_KEY, token);
        const userData = { roles };
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

        // Update state
        setUser(userData);
        setIsAuthenticated(true);

        navigate("/(tabs)/club");
      } catch (error: any) {
        const errorMessage = getErrorMessage(error);
        showError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, navigate]
  );

  const logout = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      setIsAuthenticated(false);
      setUser(null);
      navigate("/(tabs)");
    } catch (error) {
      showError("Failed to logout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, navigate]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
