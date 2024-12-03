import { useState, useEffect } from "react";
import { useWebSocket } from "../useWebSocket";

interface User {
  first_name: string;
  last_name: string;
  email: string;
  user_slug: string;
  phone: string | null;
  id: number;
}

export const useUniqueUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { isConnected, sendMessage, connectionError } = useWebSocket<User[]>({
    url: "wss://rahaclub.rahafest.com/ws/friendships", // Note: using wss:// instead of ws://
    initialMessage: {
      action: "unique-users",
    },
    tokenKey: "token",
    maxRetries: 3,
    retryDelay: 3000,
    onMessage: (data) => {
      if (data.action === "unique-users") {
        setUsers(data.users);
        setError(null);
      }
    },
    onError: (err) => {
      console.log("WS ERROR::UNIQUE USERS", err);
      const errorMessage =
        typeof err === "string"
          ? err
          : err.message || "An error occurred connecting to the server";
      setError(errorMessage);
    },
  });

  // Update error state based on connection error
  useEffect(() => {
    if (connectionError) {
      setError(connectionError);
    } else if (isConnected) {
      setError(null);
    }
  }, [connectionError, isConnected]);

  return { users, error, isConnected, sendMessage };
};
