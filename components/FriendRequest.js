import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Avatar, IconButton } from "react-native-paper";
import { useDispatch } from "react-redux";
import { acceptFriendRequest } from "../redux/friends/friendActions";
import { success } from "../utils/toast";

const FriendRequest = ({ data }) => {
  const dispatch = useDispatch();

  const firstName = data?.friendDetails["first_name"] || "";
  const lastName = data?.friendDetails["last_name"] || "";
  const initials = (firstName[0] || "") + (lastName[0] || "");
  const isAccepted = data?.is_accepted || false;
  const friendId = data?.friend || null;

  const handleAcceptFriend = () => {
    dispatch(acceptFriendRequest({ id: friendId }));
    success("Friend request accepted", 2000);
  };

  const handleCancelFriend = () => {
    console.log("cancelled");
  };

  return (
    <View style={styles.container}>
      <Avatar.Text size={50} label={initials} />
      <Text style={styles.text}>{firstName} sent you a friend request!</Text>
      {isAccepted ? (
        <View>
          <IconButton icon="cancel" mode="contained" />
        </View>
      ) : (
        <View style={styles.row}>
          <IconButton
            icon="check"
            mode="contained"
            iconColor="green"
            onPress={handleAcceptFriend}
          />
          <IconButton
            icon="cancel"
            mode="contained"
            onPress={handleCancelFriend}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
});

export default FriendRequest;
