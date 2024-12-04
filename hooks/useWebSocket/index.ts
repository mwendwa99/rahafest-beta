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
  const [isReady, setIsReady] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const messageQueueRef = useRef<object[]>([]);
  const retryCountRef = useRef(0);
  const shouldAttemptReconnectRef = useRef(true);
  const isInitialConnectionRef = useRef(true);
  const pingIntervalRef = useRef<NodeJS.Timeout>();

  // Function to process queued messages
  const processMessageQueue = useCallback(() => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    console.log(
      `Processing message queue (${messageQueueRef.current.length} messages)`
    );
    while (messageQueueRef.current.length > 0) {
      const message = messageQueueRef.current[0];
      try {
        socketRef.current.send(JSON.stringify(message));
        console.log("Successfully sent queued message:", message);
        messageQueueRef.current.shift(); // Remove sent message
      } catch (err) {
        console.error("Failed to send queued message:", err);
        break;
      }
    }
  }, []);

  const connectSocket = useCallback(async () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    if (!isInitialConnectionRef.current && !shouldAttemptReconnectRef.current) {
      console.log("Reconnection not allowed");
      return;
    }

    try {
      const token = await AsyncStorage.getItem(tokenKey);
      if (!token) throw new Error("Token not found in storage.");

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
          console.log("Connection timeout, closing socket");
          ws.close();
          throw new Error("Connection timeout");
        }
      }, 10000);

      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log("WebSocket connected successfully");
        setIsConnected(true);
        setConnectionError(null);
        retryCountRef.current = 0;

        // Setup ping interval to keep connection alive
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            try {
              ws.send(JSON.stringify({ type: "ping" }));
              console.log("Ping sent");
            } catch (err) {
              console.warn("Failed to send ping:", err);
            }
          }
        }, 30000);

        // Delay before sending initial message and processing queue
        setTimeout(() => {
          if (initialMessage && ws.readyState === WebSocket.OPEN) {
            try {
              ws.send(JSON.stringify(initialMessage));
              console.log("Initial message sent");
            } catch (err) {
              console.error("Failed to send initial message:", err);
              messageQueueRef.current.unshift(initialMessage);
            }
          }
          processMessageQueue();
          setIsReady(true);
        }, 500);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type !== "pong") {
            // Ignore pong responses
            onMessage(data);
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
          if (onError) onError("Failed to parse WebSocket message.");
        }
      };

      ws.onerror = (event: any) => {
        clearTimeout(connectionTimeout);
        const errorMessage = event.message || "WebSocket connection error";
        console.error("WebSocket error:", errorMessage);
        setConnectionError(errorMessage);
        setIsReady(false);

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
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }

        console.log(
          `WebSocket closed with code: ${event.code}, reason: ${event.reason}`
        );
        setIsConnected(false);
        setIsReady(false);

        if (
          shouldAttemptReconnectRef.current &&
          retryCountRef.current < maxRetries
        ) {
          console.log(
            `Attempting reconnection ${retryCountRef.current + 1}/${maxRetries}`
          );
          retryCountRef.current += 1;
          setTimeout(connectSocket, retryDelay);
        }
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect";
      console.error("Connection error:", errorMessage);
      setConnectionError(errorMessage);
      setIsReady(false);
      if (onError) onError(errorMessage);

      if (
        shouldAttemptReconnectRef.current &&
        retryCountRef.current < maxRetries
      ) {
        retryCountRef.current += 1;
        setTimeout(connectSocket, retryDelay);
      }
    }
  }, [url, tokenKey, maxRetries, retryDelay, processMessageQueue]);

  const sendMessage = useCallback(
    (message: object) => {
      console.log("Attempting to send message:", message);

      if (
        !socketRef.current ||
        socketRef.current.readyState !== WebSocket.OPEN
      ) {
        console.log("Socket not ready, queueing message");
        messageQueueRef.current.push(message);

        // Attempt to reconnect if socket is closed
        if (
          !socketRef.current ||
          socketRef.current.readyState === WebSocket.CLOSED
        ) {
          connectSocket();
        }
        return;
      }

      try {
        socketRef.current.send(JSON.stringify(message));
        console.log("Message sent successfully");
      } catch (err) {
        console.error("Failed to send message:", err);
        messageQueueRef.current.push(message);
        if (onError) onError("Failed to send message");
      }
    },
    [connectSocket]
  );

  useEffect(() => {
    shouldAttemptReconnectRef.current = true;
    isInitialConnectionRef.current = true;
    retryCountRef.current = 0;

    connectSocket();

    return () => {
      shouldAttemptReconnectRef.current = false;
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connectSocket]);

  return { isConnected, isReady, sendMessage, connectionError };
};
