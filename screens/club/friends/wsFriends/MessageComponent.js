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
        <View>
          <Text
            style={[
              styles.messageText,
              isCurrentUser ? styles.currentUserText : styles.otherUserText,
            ]}
          >
            {item.content}
          </Text>
        </View>
      </View>
      <View>
        <Text
          style={[
            { color: "#fafafa" },
            isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
          ]}
        >
          {formatTimestamp(item?.timestamp || "")}
        </Text>
      </View>
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
    borderRadius: 10,
    overflow: "hidden",
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
