import { FlatList, SafeAreaView, Text, View } from "react-native";
import FriendRequest from "../../components";
import AcceptedFriend from "../../components";
import { useEffect, useState } from "react";
import { getFriends, getFriendsRequests } from "../../redux/friends/friendActions";
import { useDispatch, useSelector } from "react-redux";

export default function Friends() {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { friends, friendRequests } = useSelector((state) => state.friends);
  const { token } = useSelector((state) => state.auth);

  console.log("requests:\t",friendRequests)
  console.log("friends:\t",friends[0])
  
  useEffect(() => {
    dispatch(getFriends(token));
  }, []);

  useEffect(() => {
    dispatch(getFriendsRequests(token));
  }, []);

  const acceptRequest = async (friendRequestId) => {};

  const Unfriend = async (friend) => {};

  return (
    <SafeAreaView>
      <View style={{ padding: 10, marginHorizontal: 12 }}>
        {friendRequests?.length > 0 ? (
          <Text>Your Friend Requests!</Text>
        ) : (
          <Text style={{ textAlign: "center", marginHorizontal: 20 }}>
            You have no Friend Requests!
          </Text>
        )}
        {friendRequests?.map((item, index) => (
          <FriendRequest
            key={index}
            item={item}
            friendRequests={friendRequests}
            Unfriend={Unfriend}
            setFriendRequests={setFriendRequests}
            acceptRequest={acceptRequest}
            isAccepted={isAccepted}
          />
        ))}
      </View>
      {friends?.length === 0 && (
        <Text style={{ textAlign: "center", marginHorizontal: 20 }}>
          You have no Friends!
        </Text>
      )}
      {friends?.length > 0 && (
        <Text style={{ fontSize: 20, fontWeight: 500, marginLeft: 15 }}>
          Recent friends
        </Text>
      )}
      {/* <FlatList
        data={friends}
        keyExtractor={(index) => index.toString()}
        style={{ padding: 15 }}
        renderItem={({ item }) => (
          <AcceptedFriend
            friend={item}
            // item={item}
            isLoading={isLoading}
            Unfriend={Unfriend}
          />
        )}
      /> */}
    </SafeAreaView>
  );
};

