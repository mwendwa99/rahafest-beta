import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Container from "@/components/Container";
import { useUniqueUsers } from "@/hooks/useUniqueUsers";
import ItemList from "@/components/List/ItemList";
import Typography from "@/components/Typography";

const MessagesPage = () => {
  const { users, error, isConnected } = useUniqueUsers();

  return (
    <Container style={styles.container}>
      <Typography style={styles.connection} color="#888888" align="center">
        {isConnected ? "Connected" : "Connecting..."}
      </Typography>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ItemList
            title={`${item.first_name} ${item.last_name}`}
            subtitle={item.email}
            startIcon={"person-outline"}
            endIcon="add-circle-outline"
          />
        )}
        ListEmptyComponent={
          <Text style={styles.noUsers}>
            {isConnected ? "No unique users found." : "Connecting to server..."}
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
