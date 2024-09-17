import { useCallback } from "react";
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
}) {
  const renderMessage = useCallback(
    ({ item }) => {
      const isCurrentUser = item.sender === user.id;
      return <MessageComponent item={item} isCurrentUser={isCurrentUser} />;
    },
    [user.id]
  );

  return (
    <>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setSelectedFriend(null)}
      >
        <MaterialCommunityIcons name="chevron-left" size={20} color="#fafafa" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={directMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
      />
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
  backButton: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
  },
  backButtonText: {
    color: "#fafafa",
    fontSize: 16,
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
