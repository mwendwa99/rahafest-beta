import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import PendingFriends from "./PendingFriendRequests";
import FriendsList from "./FriendsList";
import MessageComponent from "./MessageComponent";
import DirectMessages from "./DirectMessages";

import { useWebSocket } from "../../../../hooks";

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [directMessages, setDirectMessages] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const { token, user } = useSelector((state) => state.auth);
  const flatListRef = useRef(null);

  const handleFriendsMessage = useCallback((data) => {
    switch (data.action) {
      case "accepted-list":
        setFriends(data.friendships);
        break;
      case "unaccepted-list":
        setPendingRequests(data.friendships);
        break;
      case "error":
        console.error("Error from friends server:", data);
        break;
      default:
        console.warn("Unknown action from friends server:", data.action);
    }
  }, []);

  const handleDmMessage = useCallback((data) => {
    switch (data.action) {
      case "dm-list":
        setDirectMessages(data.messages);
        break;
      case "new-dm":
        setDirectMessages((prev) => [...prev, data.message]);
        flatListRef.current?.scrollToEnd({ animated: true });
        break;
      case "error":
        console.error("Error from DM server:", data);
        break;
      default:
        console.warn("Unknown action from DM server:", data.action);
    }
  }, []);

  const friendsWs = useWebSocket(
    `ws://rahaclub.rahafest.com/ws/friendships/?token=${token}`,
    handleFriendsMessage
  );

  const dmWs = useWebSocket(
    selectedFriend
      ? `ws://rahaclub.rahafest.com/ws/direct_messages/?token=${token}&friend_id=${selectedFriend}`
      : null,
    handleDmMessage
  );

  useEffect(() => {
    if (friendsWs.connected) {
      friendsWs.send({ action: "accepted-list" });
      friendsWs.send({ action: "unaccepted-list" });
    }
  }, [friendsWs.connected]);

  useEffect(() => {
    if (dmWs.connected && selectedFriend) {
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

  const handleFriendSelection = useCallback((friendId) => {
    setSelectedFriend(friendId);
    setDirectMessages([]);
  }, []);

  const renderFriend = useCallback(
    ({ item }) => (
      <FriendsList
        item={item}
        setSelectedFriend={() => handleFriendSelection(item.id)}
      />
    ),
    [handleFriendSelection]
  );

  const renderPendingRequest = useCallback(
    ({ item }) => (
      <PendingFriends
        item={item}
        acceptFriendRequest={() =>
          friendsWs.send({
            action: "accept-friendship",
            friend_id: item.friend,
          })
        }
        rejectFriendRequest={() =>
          friendsWs.send({
            action: "decline-friendship",
            friend_id: item.friend,
          })
        }
      />
    ),
    [friendsWs.send]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ ...styles.statusContainer, flex: 1 }}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: friendsWs.connected ? "green" : "orange" },
            ]}
          />
          <Text style={{ ...styles.statusText, fontSize: 24 }}>Friends</Text>
        </View>
        {selectedFriend && (
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: dmWs.connected ? "green" : "orange" },
              ]}
            />
            <Text style={styles.statusText}>
              {dmWs.connected ? "Online" : "Offline"}
            </Text>
          </View>
        )}
      </View>
      {!selectedFriend ? (
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
        <DirectMessages
          flatListRef={flatListRef}
          directMessages={directMessages}
          user={user}
          setInputMessage={setInputMessage}
          inputMessage={inputMessage}
          sendMessage={sendMessage}
          selectedFriend={selectedFriend}
          connected={dmWs.connected}
          setSelectedFriend={setSelectedFriend}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    paddingHorizontal: 10,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    borderRadius: 50,
    alignSelf: "center",
    // marginBottom: 1,
  },
  statusIndicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    color: "#fafafa",
    fontSize: 10,
    fontWeight: "700",
    margin: 0,
    padding: 0,
  },
  sectionTitle: {
    color: "#fafafa",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
});

export default FriendsPage;
