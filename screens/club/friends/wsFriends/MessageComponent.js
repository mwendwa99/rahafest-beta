import { Text, View, StyleSheet } from "react-native";
import { formatTime, formatTimestamp } from "../../../../utils/helper";

export default function MessageComponent({ item, isCurrentUser }) {
  return (
    <>
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText,
          ]}
        >
          {item.content}
        </Text>
      </View>
      <Text
        style={[
          { color: "#fafafa" },
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        {formatTimestamp(item?.timestamp || "")}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    margin: 10,
    maxWidth: "80%",
  },
  messageText: {
    padding: 10,
    borderRadius: 20,
  },
  currentUserMessage: {
    alignSelf: "flex-end",
  },
  otherUserMessage: {
    alignSelf: "flex-start",
  },
  currentUserText: {
    backgroundColor: "#fafafa",
    color: "#B9052C",
  },
  otherUserText: {
    backgroundColor: "#333",
    color: "#fafafa",
  },
});
