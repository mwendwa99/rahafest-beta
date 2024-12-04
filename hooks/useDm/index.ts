import { useState, useCallback, useEffect } from "react";
import { useWebSocket } from "../useWebSocket";

export const useDms = () => {
  const [pendingFriendships, setPendingFriendships] = useState([]);
  const [users, setUsers] = useState([]);
  const [privateChat, setPrivateChat] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isConnected, sendMessage, connectionError } = useWebSocket({
    url: "wss://rahaclub.rahafest.com/ws/direct_messages",
    tokenKey: "token",
    initialMessage: { action: "dm-list" },
    onMessage: (data) => {
      // console.log("onMessage received:", data);
      handleWebSocketMessage(data);
    },
    onError: (err) => {
      console.error("WebSocket error:", err);
      setError(typeof err === "string" ? err : "An error occurred");
      setIsLoading(false);
    },
  });

  // Centralized handler for WebSocket messages
  const handleWebSocketMessage = (data) => {
    // console.log("WebSocket message received:", data);

    if ("status" in data && data.status === "error") {
      setError(data.message);
      setIsLoading(false);
      return;
    }

    switch (data.action) {
      case "dm-list":
        // console.log("Setting users:", data.users);
        setPrivateChat(data.messages || []);
        setError(null);
        break;

      default:
        console.warn(`Unhandled action: ${data.action}`);
    }

    setIsLoading(false);
  };

  // Fetch pending requests
  const fetchChat = useCallback(
    (friendId) => {
      setIsLoading(true);
      setError(null);
      sendMessage({ action: "dm-list", friend_id: friendId });
    },
    [sendMessage]
  );

  // Get friendship status

  useEffect(() => {
    if (connectionError) {
      setError(connectionError);
    }
  }, [connectionError]);

  return {
    pendingFriendships,
    users,
    isLoading,
    error,
    isConnected,
    fetchChat,
    privateChat,
  };
};
