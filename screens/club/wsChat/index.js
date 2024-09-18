import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const WebSocketChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const { token, user } = useSelector((state) => state.auth);
  const ws = useRef(null);
  const flatListRef = useRef(null);

  const connectWebSocket = useCallback(() => {
    if (!token) return;

    ws.current = new WebSocket(
      `wss://rahaclub.rahafest.com/ws/messages/?token=${token}`
    );

    ws.current.onopen = () => {
      setConnected(true);
      ws.current.send(JSON.stringify({ action: "message-list" }));
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      handleWebSocketMessage(data);
    };

    ws.current.onerror = (e) => {
      console.error("WebSocket error:", e);
      // Log additional error details if available
      if (e.error) {
        console.error("Error details:", e.error);
      }
    };

    ws.current.onclose = (e) => {
      console.log("WebSocket Disconnected. Code:", e.code, "Reason:", e.reason);
      setConnected(false);
      setTimeout(connectWebSocket, 3000);
    };
  }, [token]);

  useEffect(() => {
    connectWebSocket();
    return () => ws.current?.close();
  }, [connectWebSocket]);

  const handleWebSocketMessage = useCallback((data) => {
    switch (data.action) {
      case "message-list":
        setMessages(data.messages);
        break;
      case "send-message":
        setMessages((prevMessages) => [...prevMessages, data.message]);
        break;
      case "error":
        console.error("Error from server:", data.message);
        break;
      default:
        console.warn("Unknown action:", data.action);
    }
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  const sendMessage = useCallback(() => {
    if (inputMessage.trim() && ws.current && connected) {
      const messageData = {
        action: "send-message",
        message: {
          sender: user.id,
          content: inputMessage.trim(),
        },
      };
      ws.current.send(JSON.stringify(messageData));
      setInputMessage("");
    }
  }, [inputMessage, connected, user.id]);

  const renderMessage = useCallback(
    ({ item }) => {
      const isCurrentUser = item.sender === user.id;
      const username = item?.sender_user_slug || "Anonymous";
      const body = item?.content || "";
      const initials = username.charAt(0) || "";

      return (
        <View
          style={[
            styles.messageContainer,
            isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
          ]}
        >
          <Avatar.Text
            size={40}
            label={initials}
            labelStyle={{ fontSize: 20 }}
            style={
              isCurrentUser ? styles.currentUserAvatar : styles.otherUserAvatar
            }
          />
          <View style={styles.messageContent}>
            {!isCurrentUser && (
              <Text style={[styles.sender, styles.otherUserText]}>
                @{username}
              </Text>
            )}
            <Text
              style={[
                styles.messageText,
                isCurrentUser ? styles.currentUserText : styles.otherUserText,
              ]}
            >
              {body}
            </Text>
          </View>
        </View>
      );
    },
    [user.id]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: connected ? "green" : "orange" },
          ]}
        />
        <Text style={styles.statusText}>Live Chat</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type a message..."
          placeholderTextColor="#fafafa"
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={!connected}
        >
          <MaterialCommunityIcons name="send" size={20} color="#fafafa" />
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    // paddingHorizontal: 10,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    borderRadius: 50,
    alignSelf: "center",
    // marginBottom: 10,
  },
  statusIndicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    color: "#fafafa",
    fontSize: 18,
    fontWeight: "700",
  },
  messageContainer: {
    margin: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  currentUserMessage: {
    flexDirection: "row-reverse",
  },
  messageContent: {
    flex: 1,
    marginHorizontal: 10,
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  messageText: {
    flexWrap: "wrap",
  },
  currentUserText: {
    textAlign: "right",
    backgroundColor: "#fafafa",
    color: "#B9052C",
    padding: 10,
    borderRadius: 20,
    width: "auto",
    // maxWidth: 200,
    alignSelf: "flex-end",
  },
  otherUserText: {
    textAlign: "left",
    color: "#fafafa",
  },
  currentUserAvatar: {
    marginLeft: 10,
  },
  otherUserAvatar: {
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: "row",
    // marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
    color: "#fafafa",
    borderRadius: 20,
  },
  sendButton: {
    backgroundColor: "#B9052C",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 25,
    height: 50,
    width: 50,
  },
});

export default WebSocketChat;
