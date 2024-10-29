import React, { useState, useEffect, useRef, useCallback, memo } from "react";
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
} from "react-native";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Memoized message component
const Message = memo(({ item, isCurrentUser }) => {
  const username = item?.sender_user_slug || "Anonymous";
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
          <Text style={[styles.sender, styles.otherUserText]}>@{username}</Text>
        )}
        <Text
          style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText,
          ]}
        >
          {item?.content || ""}
        </Text>
      </View>
    </View>
  );
});

const WebSocketChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { token, user } = useSelector((state) => state.auth);
  const ws = useRef(null);
  const flatListRef = useRef(null);
  const shouldScrollToBottom = useRef(true);

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
    if (!data || !data.action) return;

    switch (data.action) {
      case "message-list":
        if (data.messages) {
          const sortedMessages = data.messages
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            .map((message) => ({
              ...message,
              uniqueKey: `${message.id}-${generateUniqueKey()}`,
            }));
          setMessages(sortedMessages);
          setIsLoading(false);
          shouldScrollToBottom.current = true;
        }
        break;
      case "send-message":
        if (data.message) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              ...data.message,
              uniqueKey: `${data.message.id}-${generateUniqueKey()}`,
            },
          ]);
          shouldScrollToBottom.current = true;
        }
        setIsLoading(false);
        break;
      case "error":
        console.error("Error from server:", data);
        setIsLoading(false);
        break;
      default:
        console.log({ data });
        console.warn("Unknown action:", data.action);
        setIsLoading(false);
        break;
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && shouldScrollToBottom.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, []);

  const handleScroll = useCallback(({ nativeEvent }) => {
    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
    const distanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;
    shouldScrollToBottom.current = distanceFromBottom < 50;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useCallback(() => {
    if (inputMessage.trim() && ws.current && connected) {
      const messageData = {
        action: "send-message",
        content: inputMessage.trim(),
      };
      ws.current.send(JSON.stringify(messageData));
      // console.log(messageData);
      setInputMessage("");
    }
  }, [inputMessage, connected]);

  const renderMessage = useCallback(
    ({ item }) => (
      <Message item={item} isCurrentUser={item.sender === user.id} />
    ),
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 80}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.uniqueKey}
          renderItem={renderMessage}
          onScroll={handleScroll}
          onContentSizeChange={scrollToBottom}
          removeClippedSubviews={Platform.OS === "android"}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={10}
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
        <StatusBar barStyle={"light-content"} animated={true} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    paddingTop: StatusBar.currentHeight,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    alignSelf: "center",
  },
  inputContainer: {
    flexDirection: "row",
    margin: 10,
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
  sendButtonDisabled: {
    backgroundColor: "#666",
  },
});

export default WebSocketChat;
