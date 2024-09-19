import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";

import PendingFriends from "./PendingFriendRequests";
import FriendsList from "./FriendsList";
import DirectMessages from "./DirectMessages";
import { UserList } from "../../../../components";

import { useWebSocket } from "../../../../hooks";
import { success } from "../../../../utils/toast";

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [directMessages, setDirectMessages] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("Messages");
  const { token, user, allUsers } = useSelector((state) => state.auth);
  const flatListRef = useRef(null);

  const handleFriendsMessage = useCallback((data) => {
    switch (data.action) {
      case "accepted-list":
        setFriends(data.friendships);
        setIsLoading(false);
        break;
      case "unaccepted-list":
        setPendingRequests(data.friendships);
        setIsLoading(false);
        break;
      case "accept-friendship":
        // Handle accepted friendship
        console.log("accepted", data);
        setIsLoading(false);
        break;
      case "request-friendship":
        if (data.status === "success") {
          console.log(data.status);
          success("Friend request sent");
        }
        setIsLoading(false);
        break;
      case "error":
        console.log("Error from friends server:", data);
        setIsLoading(false);
        break;
      default:
        console.warn("Unknown action from friends server:", data.action);
        setIsLoading(false);
        break;
    }
  }, []);

  const handleDmMessage = useCallback((data) => {
    switch (data.action) {
      case "dm-list":
        const sortedMessages = data.messages.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setDirectMessages(sortedMessages);
        setIsLoading(false);
        break;
      case "send-dm":
        setDirectMessages((prev) => {
          const newMessages = [...prev, data.message];
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }, 100);
          return newMessages;
        });
        break;
      case "error":
        Alert.alert("Server Error", data.message);
        console.log("Error from DM server:", data);
        setIsLoading(false);
        break;
      default:
        console.warn("Unknown action from DM server:", data.action);
        setIsLoading(false);
    }
  }, []);

  const friendsWs = useWebSocket(
    `wss://rahaclub.rahafest.com/ws/friendships/?token=${token}`,
    handleFriendsMessage
  );

  const dmWs = useWebSocket(
    selectedFriend
      ? `wss://rahaclub.rahafest.com/ws/direct_messages/?token=${token}&friend_id=${selectedFriend}`
      : null,
    handleDmMessage
  );

  useEffect(() => {
    if (friendsWs.connected) {
      setIsLoading(true);
      friendsWs.send({ action: "accepted-list" });
      friendsWs.send({ action: "unaccepted-list" });
    }
  }, [friendsWs.connected]);

  useEffect(() => {
    if (dmWs.connected && selectedFriend) {
      setIsLoading(true);
      setDirectMessages([]);
      dmWs.send({ action: "dm-list", friend_id: selectedFriend });
    }
  }, [dmWs.connected, selectedFriend]);

  const sendMessage = useCallback(() => {
    if (inputMessage.trim() && dmWs.connected && selectedFriend) {
      dmWs.send({
        action: "send-dm",
        recipient: selectedFriend,
        content: inputMessage.trim(),
      });
      setInputMessage("");
    }
  }, [inputMessage, dmWs.connected, selectedFriend, dmWs.send]);

  const handleSendFriendRequest = (friendId) => {
    if (friendsWs.connected) {
      friendsWs.send({
        action: "request-friendship",
        friend_id: friendId,
      });
    } else {
      console.log("Disconnected: Could not send friend request!");
    }
  };

  const handleFriendSelection = useCallback((item) => {
    setSelectedFriend(item.friend_id);
    setTitle(item.friend_slug);
    setIsLoading(true);
    setDirectMessages([]); // Clear messages when switching friends
  }, []);

  const renderFriend = useCallback(
    ({ item }) => (
      <FriendsList
        item={item}
        setSelectedFriend={() => handleFriendSelection(item)}
      />
    ),
    [handleFriendSelection]
  );

  const acceptFriendship = (item) => {
    if (friendsWs.connected) {
      friendsWs.send({
        action: "accept-friendship",
        friend_id: item.friend_id,
      });
    } else {
      console.log("Disconnected: cannot send friend request");
    }
  };

  const renderUser = useCallback(
    ({ item }) => (
      <UserList user={item} handleSendFriendRequest={handleSendFriendRequest} />
    ),
    []
  );

  const renderPendingRequest = useCallback(
    ({ item }) => {
      return (
        <PendingFriends
          item={item}
          acceptFriendRequest={() => acceptFriendship(item)}
          rejectFriendRequest={() =>
            friendsWs.send({
              action: "decline-friendship",
              friend_id: item.friend_id,
            })
          }
        />
      );
    },
    [friendsWs.send]
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0} // Adjust offset for iOS devices
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: (
                    selectedFriend ? dmWs.connected : friendsWs.connected
                  )
                    ? "green"
                    : "orange",
                },
              ]}
            />
            <Text style={styles.statusText}>{title}</Text>
          </View>
        </View>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#fafafa"
            style={styles.loader}
          />
        ) : !selectedFriend ? (
          <>
            {pendingRequests.length > 0 && (
              <View style={styles.listContainer}>
                <Text style={styles.sectionTitle}>Pending Requests</Text>
                <FlatList
                  data={pendingRequests}
                  renderItem={renderPendingRequest}
                  keyExtractor={(item) => item.id.toString()}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>No pending requests</Text>
                  }
                />
              </View>
            )}
            {friends.length > 0 && (
              <View style={styles.listContainer}>
                <Text style={styles.sectionTitle}>Your Friends</Text>
                <FlatList
                  data={friends}
                  renderItem={renderFriend}
                  keyExtractor={(item) => item.id.toString()}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>No friends</Text>
                  }
                />
              </View>
            )}
          </>
        ) : (
          <DirectMessages
            flatListRef={flatListRef}
            directMessages={directMessages}
            user={user}
            setInputMessage={setInputMessage}
            inputMessage={inputMessage}
            sendMessage={sendMessage}
            selectedFriend={selectedFriend}
            connected={dmWs.connected}
            setSelectedFriend={(id) => {
              setSelectedFriend(id);
              if (id === null) {
                setDirectMessages([]);
                setTitle("Messages");
              }
            }}
            setTitle={setTitle}
          />
        )}
        {allUsers && allUsers.length > 0 && !selectedFriend && (
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>Add a friend</Text>
            <FlatList
              data={allUsers}
              renderItem={renderUser}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  listContainer: {
    flexShrink: 1,
    minHeight: 150,
  },
  emptyText: {
    color: "#fafafa",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  statusIndicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    color: "#fafafa",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    alignSelf: "center",
  },
  sectionTitle: {
    color: "#fafafa",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "left",
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FriendsPage;
