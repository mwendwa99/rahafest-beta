import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";

import FriendsList from "./FriendsList";
import { ListItem } from "../../../../components";

import { useWebSocket } from "../../../../hooks";

const noFriends = require("../../../../assets/no-friends.png");

const FriendsPage = ({ navigation }) => {
  const [friends, setFriends] = useState([]);
  const { token, user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  const handleFriendsMessage = useCallback((data) => {
    switch (data.action) {
      case "accepted-list":
        setFriends(data.friendships);
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

  const friendsWs = useWebSocket(
    `wss://rahaclub.rahafest.com/ws/friendships/?token=${token}`,
    handleFriendsMessage
  );

  useEffect(() => {
    if (friendsWs.connected) {
      friendsWs.send({ action: "accepted-list" });
    }
  }, [friendsWs.connected]);

  const handleOpenDM = (recipientId, senderId, recipientSlug, senderSlug) => {
    if (user.id === senderId) {
      navigation.navigate("DirectMessages", {
        friendId: recipientId,
        friendSlug: recipientSlug,
      });
    } else if (user.id === recipientId) {
      navigation.navigate("DirectMessages", {
        friendId: senderId,
        friendSlug: senderSlug,
      });
    }
  };

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading friends...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0} // Adjust offset for iOS devices
      style={styles.container}
    >
      <ListItem
        title="Add Friends"
        iconRight={"chevron-right"}
        handlePressLink={() => handleNavigate("Users")}
        disabledRight={true}
        disabledLeft={true}
      />
      <ListItem
        title={`Friend Requests `}
        iconRight={"chevron-right"}
        handlePressLink={() => handleNavigate("Pending")}
        disabledRight={true}
        disabledLeft={true}
      />
      <Text style={styles.sectionTitle}>Your Friends</Text>
      <FlatList
        data={friends}
        renderItem={({ item }) => (
          <FriendsList
            item={item}
            openDM={() =>
              handleOpenDM(
                item.recipient_id,
                item.sender_id,
                item.recipient_slug,
                item.sender_slug
              )
            } // Pass as a function
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={noFriends}
              style={{
                objectFit: "contain",
              }}
            />
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    paddingHorizontal: 10,
    margin: 0,
  },

  emptyText: {
    color: "#fafafa",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },

  sectionTitle: {
    color: "#fafafa",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "left",
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

export default FriendsPage;
