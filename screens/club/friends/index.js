import { FlatList, SafeAreaView, View } from "react-native";
import { AcceptedFriend, Text } from "../../../components";
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

  const renderFriend = ({ item, index }) => (
    <AcceptedFriend key={index} data={item} />
  );

  return (
    <SafeAreaView>
      <Text value={"Friends"} variant={"title"} />
      {friends && friends.length > 0 ? (
        <FlatList
          data={friends}
          renderItem={renderFriend}
          keyExtractor={(item, index) => index}
          // horizontal
          ListEmptyComponent={
            <Text value={"You have no friends"} variant={"body"} />
          }
          nestedScrollEnabled
        />
      ) : (
        <Text value={"You have no friends"} variant={"body"} />
      )}
    </SafeAreaView>
  );
}
