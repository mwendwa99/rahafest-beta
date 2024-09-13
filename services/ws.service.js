import { EventEmitter } from "events";

class WebSocketService extends EventEmitter {
  constructor(url) {
    super();
    this.url = url;
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.isConnected = true;
      this.socket.send(
        JSON.stringify({
          action: "message-list",
          //   token: token,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      this.emit("connected");
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.emit("message", data);
    };

    this.socket.onclose = () => {
      this.isConnected = false;
      this.emit("disconnected");
    };

    this.socket.onerror = (error) => {
      this.emit("error", error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  send(message) {
    if (this.isConnected) {
      this.socket.send(JSON.stringify(message));
    } else {
      throw new Error("WebSocket is not connected");
    }
  }
}

export const webSocketService = new WebSocketService(
  "ws://rahaclub.rahafest.com/ws/messages/"
);
