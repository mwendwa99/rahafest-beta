import React, { useLayoutEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Container from "@/components/Container";
import { useLocalSearchParams } from "expo-router";
import { useDM } from "@/hooks/useDm";
import MessageBubble from "@/components/MessageBubble";
import { useAuth } from "@/context/auth";

export default function DMPage() {
  const { friendId } = useLocalSearchParams();
  const { fetchChat, privateChat, sendDM } = useDM();
  const { user } = useAuth();

  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef(null);

  useLayoutEffect(() => {
    fetchChat(friendId);
  }, [friendId]);

  // console.log(privateChat);

  const generateUniqueKey = (message, index) => {
    return `${message.timestamp}-${message.id}-${message.sender}-${index}`;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    sendDM(newMessage);
    setNewMessage("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Container style={styles.innerContainer}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
          style={styles.messagesContainer}
        >
          {privateChat.map((message, index) => {
            const uniqueKey = generateUniqueKey(message, index);
            // console.log({ message });
            return (
              <MessageBubble
                key={uniqueKey}
                message={message}
                isOwnMessage={message.sender === user.id}
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
          />
          <Pressable
            onPress={handleSendMessage}
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.sendButtonPressed,
            ]}
          >
            <Ionicons name="send" size={24} color="#007AFF" />
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
});
