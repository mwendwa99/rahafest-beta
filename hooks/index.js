import { useCallback, useEffect, useRef, useState } from "react";

export const useWebSocket = (url, onMessage) => {
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);

  const connect = useCallback(() => {
    if (!url) {
      setConnected(false);
      return;
    }

    ws.current = new WebSocket(url);

    ws.current.onopen = () => setConnected(true);
    ws.current.onmessage = (e) => onMessage(JSON.parse(e.data));
    ws.current.onerror = (e) => console.error("WebSocket error:", e);
    ws.current.onclose = () => {
      setConnected(false);
      setTimeout(connect, 3000);
    };
  }, [url, onMessage]);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  const send = useCallback((data) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  }, []);

  return { connected, send };
};
