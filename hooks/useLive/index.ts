import { useState, useCallback, useEffect } from "react";
import { useWebSocket } from "../useWebSocket";
import { useAuth } from "@/context/auth";

export const useLive = () => {
  const [liveChat, setLiveChat] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const { isConnected, sendMessage, connectionError } = useWebSocket({
    url: "wss://rahaclub.rahafest.com/ws/messages",
    tokenKey: "token",
    initialMessage: { action: "message-list" },
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
      case "message-list":
        // Handle initial message list
        const messages = data.messages || [];
        setLiveChat(messages);
        setError(null);
        break;

      case "send-message":
        // Handle real-time message updates
        if (data.message) {
          setLiveChat((prevChat) => {
            // Remove any temporary version of this message if it exists
            const filteredChat = prevChat.filter(
              (msg) => !msg.pending && msg.id !== data.message.id
            );

            return [...filteredChat, data.message];
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
  const sendLiveMessage = useCallback(
    (content) => {
      if (!content.trim()) {
        setError("Message content cannot be empty");
        return;
      }

      // Create temporary message for optimistic update
      const tempMessage = {
        id: `temp-${Date.now()}`,
        content: content.trim(),
        sender: user?.id, // Should be replaced with actual user ID from your auth system
        sender_user_slug: user?.user_slug, // Should be replaced with actual user slug
        timestamp: new Date().toISOString(),
        is_active: true,
        pending: true,
      };

      // Add message optimistically
      setLiveChat((prevChat) => [...prevChat, tempMessage]);

      // Send the actual message
      sendMessage({
        action: "send-message",
        content: content.trim(),
      });
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
      setLiveChat([]);
    };
  }, []);

  return {
    isLoading,
    error,
    isConnected,
    sendLiveMessage,
    liveChat,
  };
};
