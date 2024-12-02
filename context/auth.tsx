// context/auth.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { useRouter, useSegments } from "expo-router";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Navigation guard to prevent multiple rapid navigations
  const navigate = useCallback(
    (path: string) => {
      if (!isLoading) {
        router.replace(path);
      }
    },
    [isLoading]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        // Your login logic here
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
        setIsAuthenticated(true);
        navigate("/(tabs)/club");
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
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
      // Your logout logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setIsAuthenticated(false);
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, navigate]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
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
