// import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Avatar, IconButton } from "react-native-paper";
import { acceptFriendRequest } from "../redux/friends/friendActions";
import { useDispatch } from "react-redux";
import { success } from "../utils/toast";
import Text from "./Text";
import { formatDate } from "../utils/helper";

const FriendRequest = ({ data }) => {
  const dispatch = useDispatch();
  console.log("s", data);

  const firstName = data?.friendDetails["first_name"] || "";
  const lastName = data?.friendDetails["last_name"] || "";
  const email = data?.friendDetails["email"] || "";
  const createdAt = data?.created_at || "";
  const initials = (firstName[0] || "") + (lastName[0] || "");
  const isAccepted = data?.is_accepted || false;
  const friendId = data?.friend || null;
  // const isAccepted = false;

  console.log();

  const handleCancelFriend = () => {
    console.log("cancelled", friendId);
    Alert.alert(
      "Cancel Friend Request",
      `friend with ID ${friendId} will be removed from your friend list`
    );
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginVertical: 10,
      }}
    >
      <Avatar.Text size={50} label={initials} />
      <View>
        <Text value={`${firstName} ${lastName}`} variant={"body"} />
        <Text value={`${email}`} variant={"small"} />
        <Text
          value={`friend since ${formatDate(createdAt)}`}
          variant={"small"}
        />
      </View>
      {isAccepted && (
        <IconButton
          icon={"delete"}
          mode="contained"
          onPress={handleCancelFriend}
        />
      )}
    </View>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
});
