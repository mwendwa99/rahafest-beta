import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useRef, useCallback } from "react";

interface WebSocketHookProps<T> {
  url: string;
  onMessage: (data: T) => void;
  onError?: (error: any) => void;
  initialMessage?: object;
  tokenKey: string;
  maxRetries?: number;
  retryDelay?: number;
}

export const useWebSocket = <T>({
  url,
  onMessage,
  onError,
  initialMessage,
  tokenKey,
  maxRetries = 3,
  retryDelay = 3000,
}: WebSocketHookProps<T>) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const shouldAttemptReconnectRef = useRef(true);
  const isInitialConnectionRef = useRef(true);

  const connectSocket = useCallback(async () => {
    // Prevent connection if already connected
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    // Prevent multiple connection attempts
    if (!isInitialConnectionRef.current && !shouldAttemptReconnectRef.current) {
      return;
    }

    try {
      const token = await AsyncStorage.getItem(tokenKey);
      if (!token) throw new Error("Token not found in storage.");

      // Convert ws:// to wss:// and http:// to https://
      let wsUrl = url
        .replace(/^ws:\/\//i, "wss://")
        .replace(/^http:\/\//i, "https://");
      wsUrl = wsUrl.replace(/\/$/, "");
      wsUrl = `${wsUrl}/?token=${token}`;

      if (isInitialConnectionRef.current) {
        console.log(
          `Attempting secure WebSocket connection ${
            retryCountRef.current + 1
          }/${maxRetries}`
        );
        isInitialConnectionRef.current = false;
      }

      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      const connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          ws.close();
          throw new Error("Connection timeout");
        }
      }, 10000);

      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        if (!isConnected) {
          console.log("WebSocket connected successfully");
          setIsConnected(true);
          setConnectionError(null);
          retryCountRef.current = 0;
        }

        if (initialMessage) {
          try {
            ws.send(JSON.stringify(initialMessage));
          } catch (err) {
            console.error("Failed to send initial message:", err);
          }
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
          if (onError) onError("Failed to parse WebSocket message.");
        }
      };

      ws.onerror = (event: any) => {
        clearTimeout(connectionTimeout);
        const errorMessage = event.message || "WebSocket connection error";
        setConnectionError(errorMessage);

        if (onError) {
          const error = {
            message: errorMessage,
            type: "WebSocket Error",
            timestamp: new Date().toISOString(),
            retryCount: retryCountRef.current,
          };
          onError(error);
        }
      };

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        setIsConnected(false);

        if (
          shouldAttemptReconnectRef.current &&
          retryCountRef.current < maxRetries
        ) {
          retryCountRef.current += 1;
          setTimeout(connectSocket, retryDelay);
        }
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect";
      setConnectionError(errorMessage);
      if (onError) onError(errorMessage);

      if (
        shouldAttemptReconnectRef.current &&
        retryCountRef.current < maxRetries
      ) {
        retryCountRef.current += 1;
        setTimeout(connectSocket, retryDelay);
      }
    }
  }, [url, tokenKey, maxRetries, retryDelay, isConnected]); // Removed initialMessage from dependencies

  useEffect(() => {
    shouldAttemptReconnectRef.current = true;
    isInitialConnectionRef.current = true;
    retryCountRef.current = 0;

    connectSocket();

    return () => {
      shouldAttemptReconnectRef.current = false;
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connectSocket]);

  const sendMessage = useCallback((message: object) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      try {
        socketRef.current.send(JSON.stringify(message));
      } catch (err) {
        console.error("Failed to send message:", err);
        if (onError) onError("Failed to send message");
      }
    } else {
      console.warn("Cannot send message - WebSocket is not connected");
    }
  }, []);

  return { isConnected, sendMessage, connectionError };
};
