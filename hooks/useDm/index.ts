import { useState, useCallback, useEffect } from "react";
import { useWebSocket } from "../useWebSocket";

export const useDM = () => {
  const [privateChat, setPrivateChat] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFriendId, setCurrentFriendId] = useState(null);

  const { isConnected, sendMessage, connectionError } = useWebSocket({
    url: "wss://rahaclub.rahafest.com/ws/direct_messages",
    tokenKey: "token",
    initialMessage: { action: "dm-list" },
    onMessage: (data) => {
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
    if ("status" in data && data.status === "error") {
      setError(data.message);
      setIsLoading(false);
      return;
    }

    switch (data.action) {
      case "dm-list":
        setPrivateChat(data.messages || []);
        setError(null);
        break;

      case "send-dm":
        if (data.message) {
          setPrivateChat((prevChat) => {
            // Check if message already exists in chat
            const messageExists = prevChat.some(
              (msg) => msg.id === data.message.id
            );

            if (messageExists) {
              return prevChat;
            }

            return [...prevChat, data.message];
          });
          setError(null);
        }
        break;

      default:
        console.warn(`Unhandled action: ${JSON.stringify(data)}`);
    }

    setIsLoading(false);
  };

  // Send new message with optimistic update
  const sendDM = useCallback(
    (content) => {
      if (!currentFriendId || !content.trim()) {
        setError("Invalid message or recipient");
        return;
      }

      // Create temporary message for optimistic update
      const tempMessage = {
        id: `temp-${Date.now()}`,
        content: content.trim(),
        sender: "currentUser", // Replace with actual user ID
        timestamp: new Date().toISOString(),
        pending: true,
      };

      // Add message optimistically
      setPrivateChat((prevChat) => [...prevChat, tempMessage]);

      // Send the actual message
      sendMessage({
        action: "send-dm",
        recipient: currentFriendId,
        content: content.trim(),
      });
    },
    [currentFriendId, sendMessage]
  );

  const fetchChat = useCallback(
    (friendId) => {
      setIsLoading(true);
      setError(null);
      setCurrentFriendId(friendId);
      sendMessage({ action: "dm-list", friend_id: friendId });
    },
    [sendMessage]
  );

  useEffect(() => {
    if (connectionError) {
      setError(connectionError);
    }
  }, [connectionError]);

  useEffect(() => {
    return () => {
      setPrivateChat([]);
      setCurrentFriendId(null);
    };
  }, []);

  return {
    isLoading,
    error,
    isConnected,
    fetchChat,
    sendDM,
    privateChat,
  };
};
