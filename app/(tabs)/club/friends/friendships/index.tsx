//@ts-nocheck
import React, { useEffect } from "react";
import { Text, FlatList, StyleSheet } from "react-native";
import Container from "@/components/Container";
import ItemList from "@/components/List/ItemList";
import Typography from "@/components/Typography";
import { useFriendships } from "@/hooks/useFriendhsip";
import { useAuth } from "@/context/auth";

const MessagesPage = () => {
  const { user: currentUser } = useAuth();
  const {
    users,
    isConnected,
    error,
    isLoading,
    sendFriendRequest,
    fetchPendingRequests,
    pendingFriendships,
  } = useFriendships();

  useEffect(() => {
    fetchPendingRequests();
  }, [isConnected, users]);

  const combinedData = [
    { type: "header", text: "" },
    ...users,
    { type: "header", text: "Pending Friendships" },
    ...pendingFriendships,
  ];

  const renderItem = ({ item }) => {
    if (item.type === "header") {
      return (
        item.text && (
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            style={{ marginVertical: 10 }}
          >
            {item.text}
          </Typography>
        )
      );
    }

    // Render pending friendships
    if (item.sender_id) {
      return (
        <ItemList
          title={`${item.recipient_slug}`}
          subtitle={"Pending"}
          startIcon={"person-outline"}
          onPress={fetchPendingRequests}
        />
      );
    }

    // Render unique users
    return (
      <ItemList
        title={`${item.first_name} ${item.last_name}`}
        subtitle={item.email}
        startIcon={"person-outline"}
        endIcon={"add-circle-outline"}
        onPress={() => sendFriendRequest(item.id)}
      />
    );
  };

  return (
    <Container style={styles.container}>
      <Typography style={styles.connection} color="#888888" align="center">
        {isConnected ? "Connected" : "Connecting..."}
      </Typography>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={combinedData}
        keyExtractor={(item, index) =>
          item.type ? `${item.type}-${index}` : item.id.toString()
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={true}
        ListEmptyComponent={
          <Text style={styles.noUsers}>
            {isConnected ? "No data available." : "Connecting to server..."}
          </Text>
        }
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
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default MessagesPage;
