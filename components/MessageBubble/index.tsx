import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import Typography from "../Typography";

const MessageBubble = ({ message, isOwnMessage }) => (
  <View
    style={[
      styles.messageContainer,
      isOwnMessage ? styles.ownMessage : styles.otherMessage,
      message.pending && styles.pendingMessage,
    ]}
  >
    <Typography
      variant="body1"
      style={[styles.messageText, { color: isOwnMessage ? "#000" : "#fff" }]}
    >
      {message.content}
    </Typography>
    <View style={styles.row}>
      <Typography
        variant="caption"
        style={[styles.timestamp, { color: isOwnMessage ? "#666" : "#ccc" }]}
      >
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Typography>
    </View>
  </View>
);

export default MessageBubble;

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  ownMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#34B7F1",
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    justifyContent: "space-between",
  },
  pendingMessage: {
    display: "none",
  },
});
