import { useCallback, useEffect, useMemo, useState } from "react";
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
  selectedFriend,
  connected,
  setSelectedFriend,
  setTitle,
}) {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if (flatListRef.current && directMessages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [directMessages]);

  // Update title when the friend is selected or when messages are fetched
  useEffect(() => {
    if (directMessages.length > 0 && selectedFriend) {
      const recipientName = directMessages[0].recipient_username;
      setUserName(recipientName);
      setTitle(recipientName);
    } else {
      setTitle("Friends");
    }
  }, [directMessages, selectedFriend, setTitle]);

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
      {!directMessages || directMessages.length === 0 ? (
        <Text
          style={{
            flex: 1,
            color: "#fafafa",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          No messages available
        </Text>
      ) : (
        <FlatList
          ref={flatListRef}
          data={directMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type a message..."
          placeholderTextColor="#fafafa"
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
    marginBottom: 10,
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
