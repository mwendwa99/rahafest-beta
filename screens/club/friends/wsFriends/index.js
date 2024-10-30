import React, { useState, useCallback, useMemo } from "react";
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
import { useFocusEffect } from "@react-navigation/native";

import FriendsList from "./FriendsList";
import { ListItem } from "../../../../components";
import { useWebSocket } from "../../../../hooks";

const noFriends = require("../../../../assets/no-friends.png");

const FriendsPage = ({ navigation }) => {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, user } = useSelector((state) => state.auth);

  // Memoize the WebSocket URL to prevent unnecessary re-renders
  const wsUrl = useMemo(
    () => `wss://rahaclub.rahafest.com/ws/friendships/?token=${token}`,
    [token]
  );

  const handleFriendsMessage = useCallback((data) => {
    switch (data.action) {
      case "accepted-list":
        setFriends(data.friendships);
        setIsLoading(false);
        break;
      case "error":
        console.error("Error from friends server:", data);
        setIsLoading(false);
        break;
      default:
        console.warn("Unknown action from friends server:", data.action);
        setIsLoading(false);
        break;
    }
  }, []);

  const friendsWs = useWebSocket(wsUrl, handleFriendsMessage);

  // Fetch friends list when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      if (friendsWs.connected) {
        friendsWs.send({ action: "accepted-list" });
      }

      // Cleanup function
      return () => {
        // Optional: Clear friends data when leaving the screen
        // setFriends([]);
      };
    }, [friendsWs.connected])
  );

  const handleOpenDM = useCallback(
    (recipientId, senderId, recipientSlug, senderSlug) => {
      const params =
        user.id === senderId
          ? {
              friendId: recipientId,
              friendSlug: recipientSlug,
            }
          : {
              friendId: senderId,
              friendSlug: senderSlug,
            };

      navigation.navigate("DirectMessages", params);
    },
    [user.id, navigation]
  );

  const handleNavigate = useCallback(
    (screen) => {
      navigation.navigate(screen);
    },
    [navigation]
  );

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Image source={noFriends} style={styles.emptyImage} />
      </View>
    ),
    []
  );

  const renderFriendItem = useCallback(
    ({ item }) => (
      <FriendsList
        item={item}
        openDM={() =>
          handleOpenDM(
            item.recipient_id,
            item.sender_id,
            item.recipient_slug,
            item.sender_slug
          )
        }
      />
    ),
    [handleOpenDM]
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0}
      style={styles.container}
    >
      {isLoading && (
        <Text style={styles.loadingText}>Fetching latest data...</Text>
      )}
      <ListItem
        title="Add Friends"
        iconRight="chevron-right"
        handlePressLink={() => handleNavigate("Users")}
        disabledRight
        disabledLeft
      />
      <ListItem
        title="Friend Requests"
        iconRight="chevron-right"
        handlePressLink={() => handleNavigate("Pending")}
        disabledRight
        disabledLeft
      />
      <Text style={styles.sectionTitle}>
        Your Friends ({friends?.length || 0})
      </Text>
      <FlatList
        data={friends}
        renderItem={renderFriendItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmptyComponent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={10}
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
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImage: {
    objectFit: "contain",
  },
  sectionTitle: {
    color: "#fafafa",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "left",
  },

  loadingText: {
    color: "#FFFFFF",
    margin: 5,
    fontSize: 10,
    textAlign: "center",
  },
});

export default FriendsPage;
