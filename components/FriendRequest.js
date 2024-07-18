// import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Avatar, IconButton } from "react-native-paper";
import { acceptFriendRequest } from "../redux/friends/friendActions";
import { useDispatch } from "react-redux";
import { success } from "../utils/toast";

const FriendRequest = ({ data }) => {
  const dispatch = useDispatch();
  // console.log("s", data);

  const firstName = data?.friendDetails["first_name"] || "";
  const lastName = data?.friendDetails["last_name"] || "";
  const initials = (firstName[0] || "") + (lastName[0] || "");
  const isAccepted = data?.is_accepted || false;
  const friendId = data?.friend || null;
  // const isAccepted = false;

  console.log();

  const handleAcceptFriend = () => {
    dispatch(acceptFriendRequest({ id: friendId }));
    success("Friend request accepted", 2000);
    // console.log("accepted", friendId);
  };
  const handleCancelFriend = () => {
    console.log("cancelled");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
      }}
    >
      <Avatar.Text size={50} label={initials} />

      <Text
        style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }}
      >
        {firstName} sent you a friend request!
      </Text>

      {isAccepted ? (
        <View>
          <IconButton icon={"cancel"} mode="contained" />
        </View>
      ) : (
        <View style={styles.row}>
          <IconButton
            icon={"check"}
            mode="contained"
            iconColor="green"
            onPress={handleAcceptFriend}
          />
          <IconButton
            icon={"cancel"}
            mode="contained"
            onPress={handleCancelFriend}
          />
        </View>
        // <ButtonComponent variant={"contained"} icon="check" />
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
