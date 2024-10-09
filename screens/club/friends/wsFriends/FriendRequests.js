import { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { useWebSocket } from "../../../../hooks";
import { useSelector } from "react-redux";
import PendingFriends from "./PendingFriendRequests";
import { success } from "../../../../utils/toast";

export default function FriendRequests() {
  const [friendRequestList, setFriendRequestList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  const handleResponse = useCallback((data) => {
    switch (data.action) {
      case "unaccepted-list":
        setFriendRequestList(data.friendships);
        setIsLoading(false);
        break;
      case "accept-friendship":
        if (data.status === "success") {
          alert("Request Accepted!");
          success("Friend request accepted");
          console.log("accepted", data);
        }
        if (data.status === "info") {
          console.log(data.message);
        }
        setIsLoading(false);
        break;
      case "error":
        console.log("Error from friends server:", data);
        setIsLoading(false);
        break;

      default:
        console.log("Websocket response action", data.action);
        break;
    }
  }, []);

  const friendsWs = useWebSocket(
    `wss://rahaclub.rahafest.com/ws/friendships/?token=${token}`,
    handleResponse
  );

  // accept a friend request
  const handleAcceptRequest = useCallback(
    (senderId) => {
      console.log("this is sender", senderId);
      if (friendsWs && friendsWs.connected) {
        try {
          friendsWs.send({
            action: "accept-friendship",
            friend_id: senderId,
          });
          console.log(`Request accepted ID: ${friendId}`);
        } catch (error) {
          console.error("Error from websocket request:", error);
        }
      } else {
        console.error("friend websocket is not connected.");
      }
    },
    [friendsWs]
  );
  const handleDeclineRequest = useCallback(
    (senderId) => {
      console.log("this is sender", senderId);
      if (friendsWs && friendsWs.connected) {
        try {
          friendsWs.send({
            action: "decline-friendship",
            friend_id: senderId,
          });
          console.log(`Request declined ID: ${friendId}`);
        } catch (error) {
          console.error("Error from websocket request:", error);
        }
      } else {
        console.error("friend websocket is not connected.");
      }
    },
    [friendsWs]
  );

  useEffect(() => {
    if (friendsWs.connected) {
      console.log("WebSocket connected, sending pending friendship request");
      friendsWs.send({ action: "unaccepted-list" });
    }

    return () => {
      if (friendsWs && friendsWs.connected) {
        friendsWs.close();
        console.log("All Users WebSocket disconnected.");
      }
    };
  }, [friendsWs.connected]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  // console.log(friendRequestList);

  return (
    <View style={styles.container}>
      <ScrollView>
        {friendRequestList && friendRequestList.length > 0 ? (
          friendRequestList.map((user) => {
            // console.log(user.sender_id);
            return (
              <PendingFriends
                item={user}
                key={user.id}
                acceptFriendRequest={() => handleAcceptRequest(user.sender_id)}
                rejectFriendRequest={() =>
                  handleDeclineRequest(friendsWs, user.sender_id)
                }
              />
            );
          })
        ) : (
          <Text style={styles.sectionTitle}>No users</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    paddingHorizontal: 10,
    margin: 0,
  },
  sectionTitle: {
    color: "#fafafa",
    fontSize: 16,
    marginVertical: 20,
    textAlign: "center",
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
