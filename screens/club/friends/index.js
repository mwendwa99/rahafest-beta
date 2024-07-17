import { FlatList, SafeAreaView, Text, View } from "react-native";
import FriendRequest from "../../../components";
import AcceptedFriend from "../../../components";
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingFriendRequests } from "../../../redux/friends/friendActions";
// const scrollViewRef = useRef(null);

export default function Friends() {
  const [isAccepted, setIsAccepted] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const { pendingRequests } = useSelector((state) => state.friends);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPendingFriendRequests());
  }, []);

  console.log(pendingRequests);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  const acceptRequest = async (friendRequestId) => {};

  const Unfriend = async (friend) => {};

  return (
    <SafeAreaView>
      <View style={{ padding: 10, marginHorizontal: 12 }}>
        {friendRequests.length > 0 ? (
          <Text>Your Friend Requests!</Text>
        ) : (
          <Text style={{ textAlign: "center", marginHorizontal: 20 }}>
            You have no Friend Requests!
          </Text>
        )}
        {friendRequests.map((item, index) => (
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
      {friends.length === 0 && (
        <Text style={{ textAlign: "center", marginHorizontal: 20 }}>
          You have no Friends!
        </Text>
      )}
      {friends.length > 0 && (
        <Text style={{ fontSize: 20, fontWeight: 500, marginLeft: 15 }}>
          Recent friends
        </Text>
      )}
      <FlatList
        data={friends}
        renderItem={({ item, index }) => (
          <AcceptedFriend
            index={index}
            item={item}
            isLoading={isLoading}
            Unfriend={Unfriend}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        style={{ padding: 15 }}
      />
    </SafeAreaView>
  );
}
