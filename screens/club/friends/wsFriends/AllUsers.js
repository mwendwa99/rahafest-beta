import { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { UserList } from "../../../../components";
import { useWebSocket } from "../../../../hooks";
import { useSelector } from "react-redux";
import { success } from "../../../../utils/toast";

export default function AllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  const handleResponse = useCallback((data) => {
    switch (data.action) {
      case "unique-users":
        setAllUsers(data.users);
        setIsLoading(false);
        break;
      case "error":
        console.log("Error from friends server:", data);
        setIsLoading(false);
        break;
      case "request-friendship":
        console.log("request friendship response", data);
        success(data.message);
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

  // Send a friend request
  const handleSendFriendRequest = useCallback(
    (friendId) => {
      if (friendsWs && friendsWs.connected) {
        try {
          friendsWs.send({
            action: "request-friendship",
            friend_id: friendId,
          });
          // alert("Request sent!");
          console.log(`Friend request sent to user ID: ${friendId}`);
        } catch (error) {
          console.error("Failed to send friend request:", error);
        }
      } else {
        console.error("WebSocket is not connected.");
      }
    },
    [friendsWs]
  );

  useEffect(() => {
    if (friendsWs.connected) {
      console.log("WebSocket connected, sending unique-users request");
      friendsWs.send({ action: "unique-users" });
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

  return (
    <View style={styles.container}>
      <ScrollView>
        {allUsers && allUsers.length > 0 ? (
          allUsers.map((user) => (
            <UserList
              key={user.id}
              user={user}
              handleSendFriendRequest={() => handleSendFriendRequest(user.id)}
            />
          ))
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
