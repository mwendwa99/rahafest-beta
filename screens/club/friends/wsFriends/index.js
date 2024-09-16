import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import PendingFriends from "./PendingFriendRequests";
import FriendsList from "./FriendsList";

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [directMessages, setDirectMessages] = useState({});
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const { token, user } = useSelector((state) => state.auth);
  const ws = useRef(null);
  const flatListRef = useRef(null);

  const connectWebSocket = useCallback(() => {
    if (!token) return;

    ws.current = new WebSocket(
      `ws://rahaclub.rahafest.com/ws/friendships/?token=${token}`
    );

    ws.current.onopen = () => {
      setConnected(true);
      ws.current.send(JSON.stringify({ action: "accepted-list" }));
      ws.current.send(JSON.stringify({ action: "unaccepted-list" }));
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      handleWebSocketMessage(data);
    };

    ws.current.onerror = (e) => console.error("WebSocket error:", e);

    ws.current.onclose = (e) => {
      console.log("WebSocket Disconnected:", e.reason);
      setConnected(false);
      setTimeout(connectWebSocket, 3000);
    };
  }, [token]);

  useEffect(() => {
    connectWebSocket();
    return () => ws.current?.close();
  }, [connectWebSocket]);

  const handleWebSocketMessage = useCallback((data) => {
    switch (data.action) {
      case "accepted-list":
        setFriends(data.friendships);
        break;
      case "unaccepted-list":
        setPendingRequests(data.friendships);
        break;
      case "dm-list":
        setDirectMessages((prevMessages) => ({
          ...prevMessages,
          [data.friendId]: data.messages,
        }));
        break;
      case "send-dm":
        setDirectMessages((prevMessages) => ({
          ...prevMessages,
          [data.friendId]: [
            ...(prevMessages[data.friendId] || []),
            data.message,
          ],
        }));
        break;
      case "error":
        console.error("Error from server:", data.message);
        break;
      default:
        console.warn("Unknown action:", data.action);
    }
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  const sendMessage = useCallback(() => {
    if (inputMessage.trim() && ws.current && connected && selectedFriend) {
      const messageData = {
        action: "send-dm",
        friendId: selectedFriend,
        message: inputMessage.trim(),
      };
      ws.current.send(JSON.stringify(messageData));
      setInputMessage("");
    }
  }, [inputMessage, connected, selectedFriend]);

  const acceptFriendRequest = useCallback(
    (requestId) => {
      if (ws.current && connected) {
        ws.current.send(
          JSON.stringify({
            action: "accept-friendship",
            requestId,
          })
        );
      }
    },
    [connected]
  );

  const rejectFriendRequest = useCallback(
    (requestId) => {
      if (ws.current && connected) {
        ws.current.send(
          JSON.stringify({
            action: "decline-friendship",
            requestId,
          })
        );
      }
    },
    [connected]
  );

  const renderFriend = useCallback(
    ({ item }) => (
      <FriendsList item={item} setSelectedFriend={setSelectedFriend} ws={ws} />
    ),
    []
  );

  const renderPendingRequest = useCallback(
    ({ item }) => (
      <PendingFriends
        item={item}
        acceptFriendRequest={acceptFriendRequest}
        rejectFriendRequest={rejectFriendRequest}
      />
    ),
    [acceptFriendRequest, rejectFriendRequest]
  );

  const renderMessage = useCallback(
    ({ item }) => {
      const isCurrentUser = item.sender === user.id;
      return (
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
      );
    },
    [user.id]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: connected ? "green" : "orange" },
          ]}
        />
        {/* <Text style={styles.statusText}>Friends</Text> */}
      </View>
      {!selectedFriend || !pendingRequests || pendingRequests.length < 1 ? (
        <>
          <Text style={styles.sectionTitle}>Pending Requests</Text>
          <FlatList
            data={pendingRequests}
            renderItem={renderPendingRequest}
            keyExtractor={(item) => item.id.toString()}
          />
          <Text style={styles.sectionTitle}>Friends</Text>
          <FlatList
            data={friends}
            renderItem={renderFriend}
            keyExtractor={(item) => item.id.toString()}
          />
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedFriend(null)}
          >
            <Text style={styles.backButtonText}>Back to Friends</Text>
          </TouchableOpacity>
          <FlatList
            ref={flatListRef}
            data={directMessages[selectedFriend] || []}
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
      )}
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    paddingHorizontal: 10,
    // height: ,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
  },
  statusIndicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    color: "#fafafa",
    fontSize: 18,
    fontWeight: "700",
  },
  sectionTitle: {
    color: "#fafafa",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  messageContainer: {
    margin: 10,
    maxWidth: "80%",
  },
  currentUserMessage: {
    alignSelf: "flex-end",
  },
  otherUserMessage: {
    alignSelf: "flex-start",
  },
  messageText: {
    padding: 10,
    borderRadius: 20,
  },
  currentUserText: {
    backgroundColor: "#fafafa",
    color: "#B9052C",
  },
  otherUserText: {
    backgroundColor: "#333",
    color: "#fafafa",
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
  backButton: {
    padding: 10,
    marginBottom: 10,
  },
  backButtonText: {
    color: "#fafafa",
    fontSize: 16,
  },
});

export default FriendsPage;
