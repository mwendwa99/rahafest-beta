// context/auth.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

type User = {
  id: string;
  name: string;
  email: string;
  // Add other user properties
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user is logged in (e.g., check AsyncStorage for token)
      // const token = await AsyncStorage.getItem('userToken');
      // if (token) {
      //   const userData = await fetchUserData(token);
      //   setUser(userData);
      //   setIsAuthenticated(true);
      // }
    } catch (error) {
      console.error("Auth status check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Implement your login logic here
      // const response = await loginAPI(email, password);
      // await AsyncStorage.setItem('userToken', response.token);
      // setUser(response.user);
      setIsAuthenticated(true);
      router.replace("/(tabs)/club/");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Clear stored credentials
      // await AsyncStorage.removeItem('userToken');
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/auth/Login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    // You might want to show a loading screen here
    return null; // or a loading component
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
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
