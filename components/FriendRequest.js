// import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, Pressable, Image } from "react-native";

const FriendRequest = ({
  item,
  friendRequests,
  setFriendRequests,
  acceptRequest,
  isAccepted,
  Unfriend,
}) => {
  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={{ uri: item.image }}
      />

      <Text
        style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }}
      >
        {item?.name} sent you a friend request!!
      </Text>

      {isAccepted ? (
        <Pressable
          onPress={() => Unfriend(item._id)}
          style={{ backgroundColor: "#FF6347", padding: 10, borderRadius: 6 }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>Unfriend</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => acceptRequest(item._id)}
          style={{ backgroundColor: "#0066b2", padding: 10, borderRadius: 6 }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default FriendRequest;
