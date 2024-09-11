import { View, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import Text from "./Text";
import Button from "./Button";

export default function UserList({
  user,
  onSendFriendReq,
  sentFriendRequest,
  pendingFriendRequests = [],
}) {
  // Check if the user is in the pending friend requests
  const isPending =
    Array.isArray(pendingFriendRequests) &&
    pendingFriendRequests.some((request) => request.friend === user.id);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Avatar.Text style={{ marginRight: 10 }} size={30} label={user.name} />
        <View style={styles.column}>
          <Text value={user.user_slug} color="#000" variant="body" />
          <Text value={user.email} color="#000" variant="small" />
        </View>
      </View>
      <Button
        onPress={() => onSendFriendReq(user.id)}
        disabled={
          (sentFriendRequest && sentFriendRequest.friend === user.id) ||
          isPending
        }
        color={
          sentFriendRequest && sentFriendRequest.friend === user.id
            ? "gray"
            : "orange"
        }
        label={
          isPending
            ? "Pending"
            : sentFriendRequest && sentFriendRequest.friend === user.id
            ? "Sent"
            : "Add Friend"
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafafa",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
  },
});
