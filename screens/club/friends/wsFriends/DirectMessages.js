import React, { useState, useRef, useCallback, useMemo } from "react";
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
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useWebSocket } from "../../../../hooks";

const MESSAGES_BATCH_SIZE = 20;

const DirectMessages = ({ route }) => {
  const { friendId, friendSlug } = route.params;
  const [directMessages, setDirectMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { token, user } = useSelector((state) => state.auth);

  // Use ref instead of state for pending message to avoid re-renders
  const pendingMessageRef = useRef(null);

  const flatListRef = useRef(null);
  const shouldScrollToBottom = useRef(true);

  const wsUrl = useMemo(
    () =>
      friendId
        ? `wss://rahaclub.rahafest.com/ws/direct_messages/?token=${token}`
        : null,
    [friendId, token]
  );

  // const scrollToBottom = useCallback((animated = true) => {
  //   if (flatListRef.current && shouldScrollToBottom.current) {
  //     flatListRef.current.scrollToEnd({ animated });
  //   }
  // }, []);
  const scrollToBottom = useCallback(() => {
    if (flatListRef?.current && shouldScrollToBottom?.current) {
      setTimeout(() => {
        flatListRef?.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, []);

  const generateUniqueKey = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const handleDMResponse = useCallback(
    (data) => {
      switch (data.action) {
        case "dm-list":
          const sortedMessages = data.messages
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            .map((message) => ({
              ...message,
              uniqueKey: `${message.id}-${generateUniqueKey()}`,
            }));
          setDirectMessages(sortedMessages);
          setIsLoading(false);
          shouldScrollToBottom.current = true;
          break;

        case "send-dm":
          setDirectMessages((prevMessages) => {
            const pendingId = pendingMessageRef.current;
            const newMessages = prevMessages.map((msg) =>
              msg.id === pendingId
                ? {
                    ...data.message,
                    uniqueKey: `${data.message.id}-${generateUniqueKey()}`,
                  }
                : msg
            );
            shouldScrollToBottom.current = true;
            return newMessages;
          });
          pendingMessageRef.current = null;
          break;

        case "error":
          console.error("Error from DM server:", data);
          setDirectMessages((prev) =>
            prev.filter((msg) => msg.id !== pendingMessageRef.current)
          );
          pendingMessageRef.current = null;
          setIsLoading(false);
          break;

        default:
          console.log(data);
          console.warn("Unknown DM action:", data.action);
          setIsLoading(false);
          break;
      }
    },
    [generateUniqueKey]
  ); // Removed pendingMessageId from dependencies

  const dmWs = useWebSocket(wsUrl, handleDMResponse);

  React.useEffect(() => {
    if (dmWs.connected && friendId) {
      setDirectMessages([]);
      dmWs.send({ action: "dm-list", friend_id: friendId });
    }
  }, [dmWs.connected, friendId]);

  React.useEffect(() => {
    scrollToBottom();
  }, [directMessages, scrollToBottom]);

  const sendMessage = useCallback(() => {
    if (inputMessage.trim() && dmWs.connected) {
      const trimmedMessage = inputMessage.trim();
      const tempId = `temp-${generateUniqueKey()}`;

      const newMessage = {
        id: tempId,
        uniqueKey: generateUniqueKey(),
        content: trimmedMessage,
        sender: user.id,
        timestamp: new Date().toISOString(),
      };

      pendingMessageRef.current = tempId;
      setDirectMessages((prev) => [...prev, newMessage]);

      const messageData = {
        action: "send-dm",
        content: trimmedMessage,
        recipient: friendId,
      };

      dmWs.send(messageData);
      setInputMessage("");
    }
  }, [inputMessage, dmWs.connected, friendId, user.id, generateUniqueKey]);

  const renderMessage = useMemo(() => {
    return ({ item }) => {
      const isCurrentUser = item.sender === user.id;
      const friendInitials = friendSlug?.charAt(0).toUpperCase() || "?";
      const userInitials = user?.user_slug?.charAt(0).toUpperCase() || "?";
      const isPending = item.id === pendingMessageRef.current;

      return (
        <View
          style={[
            styles.messageContainer,
            isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
          ]}
        >
          <Avatar.Text
            size={40}
            label={isCurrentUser ? userInitials : friendInitials}
            labelStyle={styles.avatarLabel}
            style={[
              styles.avatar,
              isCurrentUser ? styles.currentUserAvatar : styles.otherUserAvatar,
            ]}
          />
          <View style={styles.messageContent}>
            <Text
              style={[
                styles.messageText,
                isCurrentUser ? styles.currentUserText : styles.otherUserText,
              ]}
            >
              {item.content}
            </Text>
            {isPending && <Text style={styles.sendingText}>sending...</Text>}
          </View>
        </View>
      );
    };
  }, [user.id, friendSlug]);

  // Rest of the component remains the same...
  const keyExtractor = useCallback((item) => item.uniqueKey, []);

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
        style={styles.keyboardView}
      >
        <FlatList
          ref={flatListRef}
          data={directMessages}
          keyExtractor={keyExtractor}
          renderItem={renderMessage}
          maxToRenderPerBatch={MESSAGES_BATCH_SIZE}
          windowSize={5}
          initialNumToRender={MESSAGES_BATCH_SIZE}
          onContentSizeChange={() => scrollToBottom(false)}
          onLayout={() => scrollToBottom(false)}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
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
            style={[
              styles.sendButton,
              !dmWs.connected && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!dmWs.connected}
          >
            <MaterialCommunityIcons name="send" size={20} color="#fafafa" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <StatusBar barStyle="light-content" animated={true} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... existing styles ...
  sendingText: {
    color: "#999",
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
    alignSelf: "flex-end",
  },
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    paddingTop: StatusBar.currentHeight,
  },
  keyboardView: {
    flex: 1,
  },
  messageContainer: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  currentUserMessage: {
    flexDirection: "row-reverse",
  },
  messageContent: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: "flex-start",
    justifyContent: "center",
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
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
  },
  currentUserAvatar: {
    marginLeft: 10,
  },
  otherUserAvatar: {
    marginRight: 10,
  },
  avatarLabel: {
    fontSize: 20,
  },
  inputContainer: {
    flexDirection: "row",
    margin: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
    color: "#fafafa",
    borderRadius: 20,
    overflow: "hidden",
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
  sendButtonDisabled: {
    opacity: 0.5,
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
});

export default DirectMessages;
