import { EventEmitter } from "events";

class WebSocketConnection extends EventEmitter {
  constructor(baseUrl) {
    super();
    this.baseUrl = baseUrl;
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    const url = `${this.baseUrl}?token=${token}`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("ws connected");
      this.isConnected = true;
      this.emit("connected");
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("ws message", data);
      this.emit("message", data);
    };

    this.socket.onclose = () => {
      this.isConnected = false;
      this.emit("disconnected");
    };

    this.socket.onerror = (error) => {
      console.log("ws error", error);
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
      console.log("ws message", message);
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("issue with ws service", message);
      // throw new Error("WebSocket is not connected");
    }
  }
}

class WebSocketService {
  constructor() {
    this.connections = {};
  }

  createConnection(name, baseUrl) {
    if (this.connections[name]) {
      // throw new Error(`Connection '${name}' already exists`);
      console.error(`${name} connection already exists`);
    }
    this.connections[name] = new WebSocketConnection(baseUrl);
    return this.connections[name];
  }

  getConnection(name) {
    if (!this.connections[name]) {
      // throw new Error(`Connection '${name}' does not exist`);
      console.error(`${name} does not exist`);
    }
    return this.connections[name];
  }

  removeConnection(name) {
    if (this.connections[name]) {
      this.connections[name].disconnect();
      delete this.connections[name];
    }
  }
}

export const webSocketService = new WebSocketService();

// Usage example:
// const messageListWS = webSocketService.createConnection('message-list', 'ws://rahaclub.rahafest.com/ws/messages/');
// const friendshipsWS = webSocketService.createConnection('friendships', 'ws://rahaclub.rahafest.com/ws/friendships/');

// messageListWS.connect(token);
// friendshipsWS.connect(token);

// messageListWS.on('message', (data) => {
//   // Handle message-list specific data
// });

// friendshipsWS.on('message', (data) => {
//   // Handle friendships specific data
// });
