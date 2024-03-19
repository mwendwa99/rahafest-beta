import { View, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import { getInitials } from "../utils/helper";
import Text from "./Text";
import Button from "./Button";

export default function UserList({ user, onSendFriendReq, requestedFriend }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Avatar.Text
          style={{ marginRight: 10 }}
          size={30}
          label={user.name[0]}
        />
        <View style={styles.column}>
          <Text value={user.name} color="#000" variant="body" />
          <Text value={user.email} color="#000" variant="small" />
        </View>
      </View>
      <Button
        onPress={() => onSendFriendReq(user.id)}
        disabled={
          requestedFriend && requestedFriend.friend.email === user.email
            ? true
            : false
        }
        color={
          requestedFriend && requestedFriend.friend.email === user.email
            ? "gray"
            : "orange"
        }
        label={
          requestedFriend && requestedFriend.friend.email === user.email
            ? "Sent"
            : "Add Friend"
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
