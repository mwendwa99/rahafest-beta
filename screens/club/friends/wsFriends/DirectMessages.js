import { useCallback, useEffect, useMemo } from "react";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MessageComponent from "./MessageComponent";

export default function DirectMessages({
  flatListRef,
  directMessages,
  user,
  sendMessage,
  setInputMessage,
  inputMessage,
  connected,
  setSelectedFriend,
}) {
  // Sort messages by timestamp in ascending order (oldest to newest)
  const sortedMessages = useMemo(
    () =>
      directMessages
        .slice()
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
    [directMessages]
  );

  // Scroll to bottom on initial render
  // useLayoutEffect(() => {
  //   if (flatListRef.current && sortedMessages.length > 0) {
  //     flatListRef.current.scrollToEnd({ animated: false });
  //   }
  // }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (flatListRef.current && sortedMessages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [sortedMessages]);

  // Memoize renderMessage for performance optimization
  const renderMessage = useCallback(
    ({ item }) => {
      const isCurrentUser = item.sender === user.id;
      return <MessageComponent item={item} isCurrentUser={isCurrentUser} />;
    },
    [user.id]
  );

  return (
    <>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedFriend(null)}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={20}
            color="#fafafa"
          />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      {!sortedMessages || sortedMessages.length === 0 ? (
        <Text
          style={{
            flex: 1,
            color: "#fafafa",
            fontSize: 10,
            textAlign: "center",
          }}
        >
          Start chatting!
        </Text>
      ) : (
        <FlatList
          ref={flatListRef}
          data={sortedMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.uniqueKey}
          inverted={false}
          onContentSizeChange={() =>
            flatListRef.current.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current.scrollToEnd({ animated: false })}
        />
      )}
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
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    flexDirection: "row",
    padding: 10,
  },
  backButtonText: {
    color: "#fafafa",
    fontSize: 16,
    fontWeight: "700",
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
