import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import PendingFriends from "./PendingFriendRequests";
import FriendsList from "./FriendsList";
import MessageComponent from "./MessageComponent";
import DirectMessages from "./DirectMessages";
import { UserList } from "../../../../components";

import { useWebSocket } from "../../../../hooks";
import { success, warning } from "../../../../utils/toast";

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [directMessages, setDirectMessages] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("Friends");
  const { token, user, allUsers } = useSelector((state) => state.auth);
  const flatListRef = useRef(null);
  const [acceptedData, setAcceptedData] = useState(null);

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
        setAcceptedData(data);
        setIsLoading(false);
        break;
      case "request-friendship":
        console.log(data.message);
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
    setIsLoading(false);
  }, []);

  // console.log(acceptedData);

  const handleDmMessage = useCallback((data) => {
    switch (data.action) {
      case "dm-list":
        setDirectMessages(data.messages);
        setIsLoading(false);
        break;
      case "send-dm":
        setDirectMessages((prev) => [...prev, data.message]);
        flatListRef.current?.scrollToEnd({ animated: true });
        setIsLoading(false);
        break;
      case "error":
        Alert.alert("Server Error", data.message, [
          {
            text: "Cancel",
            onPress: setSelectedFriend(null),
          },
        ]);
        console.log("Error from DM server:", data);
        setIsLoading(false);
        break;
      default:
        console.warn("Unknown action from DM server:", data.action);
        setIsLoading(false);
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
      // console.log(selectedFriend);
      dmWs.send({
        action: "send-dm",
        recipient: selectedFriend,
        content: inputMessage.trim(),
      });
      setInputMessage("");
    }
  }, [inputMessage, dmWs.connected, selectedFriend, dmWs.send]);

  const handleFriendSelection = useCallback((item) => {
    setSelectedFriend(item.friend_id);
    // setDirectMessages([]);
    setTitle(item.friend_slug);
    setIsLoading(true);
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

  const renderUser = useCallback(({ item }) => <UserList user={item} />);

  // console.log({ selectedFriend });

  const renderPendingRequest = useCallback(
    ({ item }) => {
      return (
        <PendingFriends
          item={item}
          acceptFriendRequest={() =>
            friendsWs.send({
              action: "accept-friendship",
              friend_id: item.friend_id,
            })
          }
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
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ ...styles.statusContainer, flex: 1 }}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: friendsWs.connected ? "green" : "orange" },
            ]}
          />
          <Text style={{ ...styles.statusText, fontSize: 20 }}>{title}</Text>
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#fafafa"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      ) : !selectedFriend ? (
        <>
          {pendingRequests && pendingRequests.length > 0 && (
            <View style={styles.pendingContainer}>
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
          <Text style={styles.sectionTitle}>Friends</Text>
          <FlatList
            data={friends}
            renderItem={renderFriend}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No friends</Text>
            }
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
          setSelectedFriend={(id) => {
            setSelectedFriend(id);
            if (id === null) {
              setDirectMessages([]);
              setTitle("Friends");
            }
          }}
          setTitle={setTitle}
        />
      )}
      {/* <Text style={styles.sectionTitle}>Add a friend</Text>
      <FlatList
        data={allUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    paddingHorizontal: 10,
  },
  pendingContainer: {
    flexShrink: 1, // Allows the container to shrink based on content
    // Optionally add padding or margin if needed
  },
  emptyText: {
    color: "#fafafa",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
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
    marginVertical: 20,
  },
});

export default FriendsPage;
