import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
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
import { useWebSocket } from "../../../../hooks";

const DirectMessages = ({ route }) => {
  const { friendId, friendSlug } = route.params;
  const [directMessages, setDirectMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const { token, user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef(null);

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
          break;
        case "send-dm":
          setDirectMessages((prevMessages) => [
            ...prevMessages,
            {
              ...data.message,
              uniqueKey: `${prevMessages.id}-${generateUniqueKey()}`,
            },
          ]);
          setIsLoading(false);
          break;
        case "error":
          console.warn("Error from DM server:", data);
          setIsLoading(false);
          break;
        default:
          console.warn("Unknown DM action:", data);
          setIsLoading(false);
          break;
      }
    },
    [generateUniqueKey]
  );

  const dmWs = useWebSocket(
    friendId
      ? `wss://rahaclub.rahafest.com/ws/direct_messages/?token=${token}`
      : null,
    handleDMResponse
  );

  useEffect(() => {
    if (dmWs.connected && friendId) {
      setDirectMessages([]);
      dmWs.send({ action: "dm-list", friend_id: friendId });
    }
  }, [dmWs.connected, friendId]);

  useLayoutEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [directMessages]);

  const sendMessage = useCallback(() => {
    if (inputMessage.trim() && dmWs.connected) {
      const messageData = {
        action: "send-dm",
        content: inputMessage.trim(),
        recipient: friendId,
      };

      dmWs.send(messageData);
      setInputMessage("");
    }
  }, [inputMessage, dmWs.connected, friendId]);

  const renderMessage = useCallback(
    ({ item }) => {
      const isCurrentUser = item.sender === user.id;
      const body = item?.content || "";
      const friendInitials = friendSlug.charAt(0) || "";
      const userInitials = user?.user_slug.charAt(0) || "";

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
            labelStyle={{ fontSize: 20 }}
            style={
              isCurrentUser ? styles.currentUserAvatar : styles.otherUserAvatar
            }
          />
          <View style={styles.messageContent}>
            <Text
              style={[
                styles.messageText,
                isCurrentUser ? styles.currentUserText : styles.otherUserText,
              ]}
            >
              {body}
            </Text>
          </View>
        </View>
      );
    },
    [user.id, friendSlug]
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
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatListRef}
          data={directMessages}
          keyExtractor={(item) => item.uniqueKey}
          renderItem={renderMessage}
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
            disabled={!dmWs.connected}
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
    // paddingHorizontal: 10,
  },
  statusIndicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  inputContainer: {
    flexDirection: "row",
    margin: 10,
  },
  statusText: {
    color: "#fafafa",
    fontSize: 18,
    fontWeight: "700",
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
    width: "auto",
    // maxWidth: 200,
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
