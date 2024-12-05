import React, { useRef, useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Container from "@/components/Container";
import { useLive } from "@/hooks/useLive";
import MessageBubble from "@/components/MessageBubble";
import { useAuth } from "@/context/auth";

export default function LivePage() {
  const { liveChat, sendLiveMessage, isConnected, error } = useLive();
  const { user } = useAuth();

  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const generateUniqueKey = (message: any, index: number) => {
    return `${message.timestamp}-${message.id}-${message.sender}-${index}`;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    sendLiveMessage(newMessage);
    setNewMessage("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 130 : undefined}
      style={styles.container}
    >
      <Container style={styles.innerContainer}>
        {!isConnected && (
          <View style={styles.connectionStatus}>
            <Text style={styles.connectionText}>
              Connecting to live chat...
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
          style={styles.messagesContainer}
        >
          {liveChat.map((message, index) => {
            const uniqueKey = generateUniqueKey(message, index);
            return (
              <MessageBubble
                key={uniqueKey}
                message={message}
                isOwnMessage={message.sender === user?.id}
              />
            );
          })}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#666"
            multiline
            editable={isConnected}
          />
          <Pressable
            onPress={handleSendMessage}
            disabled={!isConnected}
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.sendButtonPressed,
              !isConnected && styles.sendButtonDisabled,
            ]}
          >
            <Ionicons
              name="send"
              size={24}
              color={isConnected ? "#007AFF" : "#666"}
            />
          </Pressable>
        </View>
      </Container>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  innerContainer: {
    flex: 1,
  },
  connectionStatus: {
    padding: 8,
    backgroundColor: "#333",
    alignItems: "center",
  },
  connectionText: {
    color: "#fff",
    fontSize: 14,
  },
  errorContainer: {
    padding: 8,
    backgroundColor: "#ff0000",
    alignItems: "center",
  },
  errorText: {
    color: "#fff",
    fontSize: 14,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#111",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#222",
    borderRadius: 20,
    color: "#fff",
  },
  sendButton: {
    padding: 8,
  },
  sendButtonPressed: {
    opacity: 0.7,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
