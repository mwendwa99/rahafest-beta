//@ts-nocheck
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
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

interface RegisterResponse {
  status: string;
  message: string;
  data: {
    first_name: string;
    last_name: string;
    email: string;
    user_slug: string;
    phone?: string | null;
    id: number;
  };
}

interface User {
  roles: number[];
  first_name?: string;
  last_name?: string;
  email?: string;
  user_slug?: string;
  phone?: string | null;
  id?: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    password_confirm: string,
    phone?: string | undefined
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const TOKEN_KEY = "token";
const USER_KEY = "user";

const AuthContext = createContext<AuthContextType | null>(null);

function showError(message: string) {
  Alert.alert("Error", message, [{ text: "OK", onPress: () => {} }]);
}

function showSuccess(message: string) {
  Alert.alert("Success", message, [{ text: "OK", onPress: () => {} }]);
}

function getErrorMessage(error: any): string {
  if (!error.response) {
    return "Unable to connect to server. Please check your internet connection.";
  }

  switch (error.response.status) {
    case 400:
      return "Invalid input. Please check your information.";
    case 401:
      return "Invalid credentials. Please check your information.";
    case 403:
      return "Your account doesn't have permission to access this feature.";
    case 404:
      return "Service not available. Please try again later.";
    case 409:
      return "An account with this email already exists.";
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

  useEffect(() => {
    const initializeAuth = async () => {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      // console.log("Initial auth token:", token); // Debug log
      if (token) {
        setIsAuthenticated(true);
        await getUser();
      }
    };
    initializeAuth();
  }, []);

  const navigate = useCallback(
    (path: string) => {
      if (!isLoading) {
        router.replace(path);
      }
    },
    [isLoading, router]
  );

  const getUser = useCallback(async () => {
    try {
      const response = await authInstance.get<RegisterResponse>("/user");
      const userData = {
        ...user,
        ...response.data.data,
      };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  }, [user]);

  const login = useCallback(
    async (email: string, password: string) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        const response = await authInstance.post<LoginResponse>("/login", {
          email,
          password,
        });

        console.log("Login response:", response.data); // Debug log

        const { token, roles } = response.data.data;

        console.log("Token to store:", token); // Debug log

        try {
          await AsyncStorage.setItem(TOKEN_KEY, token);
          const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
          console.log("Stored token verification:", storedToken); // Verify storage
        } catch (storageError) {
          console.error("AsyncStorage error:", storageError);
          throw storageError;
        }

        const userData = { roles };
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);

        // Fetch user details after successful login
        await getUser();

        navigate("/(tabs)/club");
      } catch (error: any) {
        const errorMessage = getErrorMessage(error);
        showError(errorMessage);
        console.error("Login error:", error); // Debug log
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, navigate, getUser]
  );

  const register = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      password_confirm: string,
      phone: string | undefined
    ) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        const response = await authInstance.post<RegisterResponse>(
          "/register",
          {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            password_confirm,
            phone: phone || null,
          }
        );

        showSuccess(response.data.message);
        // After successful registration, automatically log in
        await login(email, password);
      } catch (error: any) {
        const errorMessage = getErrorMessage(error);
        showError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, login]
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
        register,
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
