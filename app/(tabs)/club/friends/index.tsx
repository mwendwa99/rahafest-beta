import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  TouchableOpacity,
} from "react-native";
import Container from "@/components/Container";
import ItemList from "@/components/List/ItemList";
import Typography from "@/components/Typography";
import { useFocusEffect, useRouter } from "expo-router";
import { useFriendships } from "@/hooks/useFriendhsip";
import { useAuth } from "@/context/auth";

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   RefreshControl,
//   TouchableOpacity,
// } from "react-native";
// import { useAuth } from "path-to-auth-hook";
// import { useFriendships } from "path-to-friendships-hook";
// import { useRouter } from "expo-router";

const MessagesPage = () => {
  const { user } = useAuth();
  const { userFriends, fetchUserFriends, error, isConnected } =
    useFriendships();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      console.log("WebSocket connected, fetching user friends");
      handleFetchFriends();
    } else {
      console.log("WebSocket not connected yet");
    }
  }, [isConnected]); // React to isConnected changes

  const handleFetchFriends = async () => {
    try {
      setRefreshing(true);
      await fetchUserFriends();
    } catch (err) {
      console.error("Error fetching friends:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const getOtherPersonId = (
    item: { sender_id: number; recipient_id: number },
    userId: number
  ): number => {
    return item.recipient_id === userId ? item.sender_id : item.recipient_id;
  };

  const getOtherPersonSlug = (
    item: { sender_id: number; recipient_id: number },
    userId: number
  ): number => {
    return item.recipient_id === userId
      ? item.sender_slug
      : item.recipient_slug;
  };

  // console.log(userFriends);

  return (
    <Container style={styles.container}>
      <Typography style={styles.connection} color="#888888" align="center">
        {isConnected ? "Connected" : "Connecting..."}
      </Typography>
      <ItemList
        title={"Add Friends"}
        endIcon="chevron-forward-circle-outline"
        onPress={() => router.push("club/friends/friendships")}
      />
      {error && (
        <Typography style={styles.errorText} color="#f00" align="center">
          {error}
        </Typography>
      )}
      <View style={{ marginVertical: 20 }}>
        <Typography variant="h5" align="left">
          Your Friends ({userFriends.length})
        </Typography>
      </View>
      <FlatList
        data={userFriends}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            onRefresh={fetchUserFriends}
            refreshing={refreshing}
          />
        }
        renderItem={({ item }) => {
          const otherPersonSlug = getOtherPersonSlug(item, user.id);
          const otherPersonId = getOtherPersonId(item, user.id);

          return (
            <ItemList
              avatar={otherPersonSlug}
              title={otherPersonSlug}
              endIcon="send-outline"
              onPress={() =>
                router.push({
                  pathname: "club/friends/dms",
                  params: {
                    friendId: otherPersonId,
                  },
                })
              }
            />
          );
        }}
        showsVerticalScrollIndicator={true}
      />
    </Container>
  );
};

// export default MessagesPage;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: "#000",
  },
  connection: {
    fontSize: 10,
    // fontWeight: "bold",
  },
  noUsers: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 10,
  },
});

export default MessagesPage;
