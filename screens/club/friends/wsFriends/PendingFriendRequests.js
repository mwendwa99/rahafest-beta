import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

export default function PendingFriends({
  item,
  acceptFriendRequest,
  rejectFriendRequest,
}) {
  return (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>
        {item.user_slug || "Anonymous"} wants to be your friend
      </Text>
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => acceptFriendRequest(item.id)}
      >
        <Text style={styles.buttonText}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.rejectButton}
        onPress={() => rejectFriendRequest(item.id)}
      >
        <Text style={styles.buttonText}>Reject</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  requestText: {
    color: "#fafafa",
    flex: 1,
  },
  acceptButton: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  rejectButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fafafa",
  },
});
