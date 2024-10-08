import { useCallback, useEffect, useRef, useState } from "react";

export const useWebSocket = (url, onMessage) => {
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);
  const reconnectDelay = useRef(3000); // Starting delay for reconnection

  const connect = useCallback(() => {
    if (!url) {
      setConnected(false);
      return;
    }

    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
      reconnectDelay.current = 3000; // Reset delay on successful connection
    };

    ws.current.onmessage = (e) => {
      try {
        onMessage(JSON.parse(e.data));
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.current.onerror = (e) => {
      console.error("WebSocket error:", e);
      // Optional: Implement more sophisticated error handling here
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
      // Attempt to reconnect after a delay
      setTimeout(() => {
        console.log("Attempting to reconnect...");
        connect();
      }, reconnectDelay.current);

      // Increase the delay for subsequent reconnections to avoid hammering the server
      reconnectDelay.current = Math.min(reconnectDelay.current * 2, 30000); // Max 30 seconds
    };
  }, [url, onMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close(); // Clean up on unmount or URL change
      }
    };
  }, [connect]);

  const send = useCallback((data) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not open, cannot send message.");
    }
  }, []);

  const close = useCallback(() => {
    if (ws.current) {
      ws.current.close();
    }
  }, []);

  return { connected, send, close }; // Expose 'close' function
};
