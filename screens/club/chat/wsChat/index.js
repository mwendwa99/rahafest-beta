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
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const WebSocketChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { token, user } = useSelector((state) => state.auth);
  const ws = useRef(null);
  const flatListRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef(null);

  const connectWebSocket = useCallback(() => {
    if (!token) return;

    const setupWebSocket = () => {
      ws.current = new WebSocket(
        `wss://rahaclub.rahafest.com/ws/messages/?token=${token}`
      );

      ws.current.onopen = () => {
        reconnectAttempts.current = 0;
        setConnected(true);
        ws.current.send(JSON.stringify({ action: "message-list" }));
      };

      ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        handleWebSocketMessage(data);
      };

      ws.current.onerror = (e) => {
        console.error("WebSocket error:", e);
      };

      ws.current.onclose = (e) => {
        console.log("WebSocket disconnected, reconnecting...");
        setConnected(false);
        const delay = Math.min(
          3000 * Math.pow(2, reconnectAttempts.current),
          30000
        );
        reconnectTimeout.current = setTimeout(setupWebSocket, delay);
        reconnectAttempts.current++;
      };
    };

    setupWebSocket();

    return () => {
      clearTimeout(reconnectTimeout.current);
      ws.current?.close();
    };
  }, [token]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      clearTimeout(reconnectTimeout.current);
      ws.current?.close();
    };
  }, [connectWebSocket]);

  const handleWebSocketMessage = useCallback((data) => {
    switch (data.action) {
      case "message-list":
        setMessages(
          data.messages.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          )
        );
        setIsLoading(false);
        break;
      case "send-message":
        setMessages((prev) => [...prev, data.message]);
        break;
      case "error":
        console.error("Server error:", data);
        break;
      default:
        console.warn("Unknown action:", data.action);
    }
  }, []);

  const sendMessage = useCallback(() => {
    if (inputMessage.trim() && ws.current && connected) {
      // Optimistic update
      const tempMessage = {
        id: `temp-${Date.now()}`,
        content: inputMessage.trim(),
        sender: user.id,
        timestamp: new Date().toISOString(),
        isPending: true,
      };

      setMessages((prev) => [...prev, tempMessage]);
      setInputMessage("");
      Keyboard.dismiss();

      // Actual WebSocket send
      ws.current.send(
        JSON.stringify({
          action: "send-message",
          content: inputMessage.trim(),
        })
      );
    }
  }, [inputMessage, connected, user.id]);

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const MessageItem = React.memo(({ item, isCurrentUser }) => {
    const username = item?.sender_user_slug || "Anonymous";
    const initials = username.charAt(0) || "";
    const isAdmin = item.sender === 57;

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
          isAdmin && styles.adminBubble,
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
              item.isPending && styles.pendingMessage,
            ]}
          >
            {item.content}
            {item.isPending && (
              <ActivityIndicator
                size="small"
                color="#666"
                style={styles.pendingIndicator}
              />
            )}
          </Text>
        </View>
      </View>
    );
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageItem item={item} isCurrentUser={item.sender === user.id} />
          )}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={20}
          maxToRenderPerBatch={10}
          windowSize={21}
          removeClippedSubviews={true}
        />
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 85 : 20}
        > */}
        {/* <View> */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Type a message..."
              placeholderTextColor="#666"
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              multiline={false}
              blurOnSubmit={true}
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={!connected}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="send" size={20} color="#fafafa" />
            </TouchableOpacity>
          </View>
          {/* </View> */}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#1B1B1B",
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
  },
  flatList: {
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
    borderRadius: 10,
    overflow: "hidden",
    width: "auto",
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
  // inputContainer: {
  //   flexDirection: "row",
  //   padding: 10,
  //   backgroundColor: "#1B1B1B",
  //   borderTopWidth: 1,
  //   borderTopColor: "#333",
  //   alignItems: "center",
  //   minHeight: 60,
  // },
  // input: {
  //   flex: 1,
  //   height: 40,
  //   borderWidth: 1,
  //   borderColor: "#333",
  //   paddingHorizontal: 15,
  //   marginRight: 10,
  //   color: "#fafafa",
  //   borderRadius: 20,
  //   backgroundColor: "#2D2D2D",
  //   fontSize: 16,
  // },
  sendButton: {
    backgroundColor: "#B9052C",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 20,
    height: 40,
    width: 40,
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
  adminBubble: {
    backgroundColor: "#6200ea",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#bb86fc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  pendingMessage: {
    opacity: 0.7,
  },
  pendingIndicator: {
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#1B1B1B",
    borderTopWidth: 1,
    borderTopColor: "#333",
    alignItems: "center",
    minHeight: 70, // Increased minimum height
    paddingBottom: 25, // Added bottom padding for iOS safe area
  },
  input: {
    flex: 1,
    minHeight: 45, // Increased minimum height
    borderWidth: 1,
    borderColor: "#B9052C", // More visible border color
    paddingHorizontal: 15,
    marginRight: 10,
    color: "#fafafa",
    borderRadius: 25,
    backgroundColor: "#2D2D2D",
    fontSize: 16,
    includeFontPadding: true, // Ensure text vertical centering
  },
  // Add these new styles:
  keyboardAvoidingView: {
    position: "relative",
    zIndex: 999,
  },
});

export default WebSocketChat;
