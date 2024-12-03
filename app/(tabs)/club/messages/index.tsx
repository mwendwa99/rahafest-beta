import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Container from "@/components/Container";
import { useUniqueUsers } from "@/hooks/useUniqueUsers";
import ItemList from "@/components/List/ItemList";
import Typography from "@/components/Typography";
import { useRouter } from "expo-router";

const MessagesPage = () => {
  const { users, error, isConnected } = useUniqueUsers();
  const router = useRouter();

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
