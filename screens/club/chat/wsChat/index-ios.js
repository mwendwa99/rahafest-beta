import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  Dimensions,
} from "react-native";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const WebSocketChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { token, user } = useSelector((state) => state.auth);
  const ws = useRef(null);
  const flatListRef = useRef(null);

  // Keyboard event handlers
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const generateUniqueKey = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

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
        const sortedMessages = data.messages
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          .map((message) => ({
            ...message,
            uniqueKey: `${message.id}-${generateUniqueKey()}`,
          }));
        setMessages(sortedMessages);
        setIsLoading(false);
        break;
      case "send-message":
        setMessages((prevMessages) => {
          const messageExists = prevMessages.some(
            (msg) => msg.id === data.message.id
          );
          if (messageExists) return prevMessages;

          return [
            ...prevMessages,
            {
              ...data.message,
              uniqueKey: `${data.message.id}-${generateUniqueKey()}`,
            },
          ];
        });
        setIsLoading(false);
        break;
      case "error":
        console.error("Error from server:", data);
        setIsLoading(false);
        break;
      default:
        console.warn("Unknown action:", data.action);
        setIsLoading(false);
        break;
    }
  }, []);

  useLayoutEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = useCallback(() => {
    if (inputMessage.trim() && ws.current && connected) {
      const messageData = {
        action: "send-message",
        content: inputMessage.trim(),
      };
      ws.current.send(JSON.stringify(messageData));
      setInputMessage("");
      if (Platform.OS === "android") {
        Keyboard.dismiss();
      }
    }
  }, [inputMessage, connected]);

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
                {username}
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.keyboardView}
          keyboardVerticalOffset={90}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.uniqueKey}
            renderItem={renderMessage}
            contentContainerStyle={[
              styles.flatListContent,
              { paddingBottom: keyboardHeight },
            ]}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Type a message..."
              placeholderTextColor="#fafafa"
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={!connected}
            >
              <MaterialCommunityIcons name="send" size={20} color="#fafafa" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.uniqueKey}
            renderItem={renderMessage}
            contentContainerStyle={styles.flatListContent}
            style={{ flex: 1 }}
          />
          <View
            style={[styles.inputContainer, { marginBottom: keyboardHeight }]}
          >
            <TextInput
              style={styles.input}
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Type a message..."
              placeholderTextColor="#fafafa"
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={!connected}
            >
              <MaterialCommunityIcons name="send" size={20} color="#fafafa" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
  },
  keyboardView: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 10,
  },
  messageContainer: {
    margin: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  currentUserMessage: {
    flexDirection: "row-reverse",
    maxWidth: "75%",
    alignSelf: "flex-end",
  },
  messageContent: {
    flex: 1,
    marginHorizontal: 10,
    maxWidth: "75%",
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
    borderRadius: 10,
    overflow: "hidden",
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 10,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#1B1B1B",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
    color: "#fafafa",
    borderRadius: 20,
    backgroundColor: "#1B1B1B",
    minHeight: 40,
  },
  sendButton: {
    backgroundColor: "#B9052C",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 25,
    overflow: "hidden",
    height: 50,
    width: 50,
  },
});

export default WebSocketChat;
