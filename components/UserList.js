import { View, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import { getInitials } from "../utils/helper";
import Text from "./Text";
import Button from "./Button";

export default function UserList({ user, onSendFriendReq, sentFriendRequest }) {
  // console.log(sentFriendRequest);
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
          sentFriendRequest && sentFriendRequest.is_accepted === false
            ? true
            : false
        }
        color={
          sentFriendRequest && sentFriendRequest.is_accepted === false
            ? "gray"
            : "orange"
        }
        label={
          sentFriendRequest && sentFriendRequest.is_accepted === false
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
