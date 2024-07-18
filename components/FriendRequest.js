// import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, Pressable, View, StyleSheet } from "react-native";
import { Avatar, IconButton } from "react-native-paper";

const FriendRequest = ({ data }) => {
  console.log("s", data);

  const firstName = data?.friendDetails["first_name"] || "";
  const lastName = data?.friendDetails["last_name"] || "";
  const initials = (firstName[0] || "") + (lastName[0] || "");
  // const isAccepted = data?.is_accepted || false;
  const isAccepted = false;

  const handleAcceptFriend = () => {
    console.log("accepted");
  };
  const handleCancelFriend = () => {
    console.log("cancelled");
  };

  return (
    <Pressable
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
    </Pressable>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
});
