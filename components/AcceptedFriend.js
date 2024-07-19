import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Avatar, IconButton } from "react-native-paper";
import { useDispatch } from "react-redux";
import Text from "./Text";
import { formatDate } from "../utils/helper";

const FriendRequest = ({ data, type, navigation }) => {
  const dispatch = useDispatch();

  const firstName = data?.friendDetails["first_name"] || "";
  const lastName = data?.friendDetails["last_name"] || "";
  const email = data?.friendDetails["email"] || "";
  const createdAt = data?.created_at || "";
  const initials = (firstName[0] || "") + (lastName[0] || "");
  const isAccepted = data?.is_accepted || false;
  const friendId = data?.friend || null;
  const friendDetails = data?.friendDetails || {};

  const handleCancelFriend = () => {
    Alert.alert(
      "Cancel Friend Request",
      `Friend with ID ${friendId} will be removed from your friend list`
    );
  };

  const handleNavigateToDM = () => {
    console.log("Navigate to Direct Message", friendId);
    // Add navigation logic here
    navigation.navigate("DirectMessage", { friendDetails });
  };

  // console.log(data);

  const renderIconButton = () => {
    switch (type) {
      case "message":
        return (
          <IconButton
            icon="send"
            mode="contained"
            onPress={handleNavigateToDM}
          />
        );
      case "profile":
        return (
          <IconButton
            icon="delete"
            mode="contained"
            onPress={handleCancelFriend}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Avatar.Text size={50} label={initials} />
      <View style={styles.info}>
        <Text value={`${firstName} ${lastName}`} variant={"body"} />
        <Text value={`${email}`} variant={"small"} />
        <Text
          value={`Friend since ${formatDate(createdAt)}`}
          variant={"small"}
        />
      </View>
      <View style={styles.actions}>{isAccepted && renderIconButton()}</View>
    </View>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
