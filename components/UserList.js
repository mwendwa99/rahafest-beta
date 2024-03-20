import { View, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import { getInitials } from "../utils/helper";
import Text from "./Text";
import Button from "./Button";

export default function UserList({
  allUsers,
  onSendFriendReq,
  sentFriendRequest,
  cancelRequest,
  user,
}) {
  // console.log("sentfriendReq::\t",sentFriendRequest);
  // console.log(allUsers.friendships[0])
  // console.log(allUsers)
  // console.log(user);
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Avatar.Text
          style={{ marginRight: 10 }}
          size={30}
          label={allUsers.name[0]}
        />
        <View style={styles.column}>
          <Text value={allUsers.name} color="#000" variant="body" />
          <Text value={allUsers.email} color="#000" variant="small" />
        </View>
      </View>
      {sentFriendRequest && sentFriendRequest.is_accepted === false && sentFriendRequest?.friend?.id === allUsers?.id ?
        (
          <Button
            onPress={() => cancelRequest(allUsers.id)}
            color={"gray"}
            label={"Cancel request"}
          />
        ) : (
          <Button
            onPress={() => onSendFriendReq(allUsers.id)}
            color={"orange"}
            label={"Add Friend"}
          />
        )
      }
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
