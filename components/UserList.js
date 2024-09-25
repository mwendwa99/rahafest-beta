import { View, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import Text from "./Text";
import Button from "./Button";

export default function UserList({
  user,
  handleSendFriendRequest,
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
        <Avatar.Text
          style={{ marginRight: 10 }}
          size={30}
          label={
            user?.friend_user_slug
              ? user.friend_user_slug.charAt(0).toUpperCase()
              : user?.user_slug
              ? user.user_slug.charAt(0).toUpperCase()
              : "?" // Fallback label if slug is null, empty, or undefined
          }
        />
        <View style={styles.column}>
          <Text
            value={
              user?.friend_user_slug
                ? user.friend_user_slug
                : user?.user_slug
                ? user.user_slug
                : "Anonymous"
            }
            style={{
              color: "#fafafa",
            }}
            variant="body"
          />
          <Text
            value={user.email}
            style={{
              color: "#fafafa",
            }}
            variant="small"
          />
        </View>
      </View>
      <Button
        onPress={handleSendFriendRequest}
        disabled={
          (sentFriendRequest && sentFriendRequest.friend === user.id) ||
          isPending
        }
        color={
          sentFriendRequest && sentFriendRequest.friend === user.id
            ? "gray"
            : "orange"
        }
        label="add"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#fafafa",
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
