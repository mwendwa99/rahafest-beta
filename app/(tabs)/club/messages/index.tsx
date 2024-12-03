import React, { useEffect, useLayoutEffect } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import Container from "@/components/Container";
import ItemList from "@/components/List/ItemList";
import Typography from "@/components/Typography";
import { useRouter } from "expo-router";
import { useFriendships } from "@/hooks/useFriendhsip";
import { useAuth } from "@/context/auth";

const MessagesPage = () => {
  const { user } = useAuth();
  const { userFriends, fetchUserFriends, error, isConnected, isLoading } =
    useFriendships();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      console.log("WebSocket connected, fetching user friends");
      fetchUserFriends();
    } else {
      console.log("WebSocket not connected yet");
    }
  }, [isConnected, fetchUserFriends]); // Empty dependency array to avoid infinite retries

  console.log({ userFriends });

  return (
    <Container style={styles.container}>
      <Typography style={styles.connection} color="#888888" align="center">
        {isConnected ? "Connected" : "Connecting..."}
      </Typography>
      <ItemList
        title={"Add Friends"}
        endIcon="chevron-forward-circle-outline"
        onPress={() => router.push("club/messages/friends")}
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
          <RefreshControl onRefresh={fetchUserFriends} refreshing={isLoading} />
        }
        renderItem={({ item }) => (
          <ItemList
            title={
              item.recipient_id === user.id
                ? item.sender_slug
                : item.recipient_slug
            }
            endIcon="send-outline"
            onPress={() => router.push("club/messages/friends")}
          />
        )}
        showsVerticalScrollIndicator={true}
        // ListEmptyComponent={
        //   <Text style={styles.noUsers}>
        //     {isConnected ? "No data available." : "Connecting to server..."}
        //   </Text>
        // }
      />
    </Container>
  );
};

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
