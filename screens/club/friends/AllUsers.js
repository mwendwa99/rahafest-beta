import { StyleSheet, ScrollView } from "react-native";
import { UserList } from "../../../components";
import { sendFriendRequest } from "../../../redux/friends/friendActions";
import { useDispatch, useSelector } from "react-redux";

export default function AllUsers({
  pendingFriendRequests,
  nonFriends,
  sentFriendRequest,
}) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onSendFriendReq = (friend) => {
    const data = {
      user: user.id,
      friend: friend,
    };
    dispatch(sendFriendRequest(data));
  };

  // console.log({ nonFriends });
  // console.log({ pendingFriendRequests });

  return (
    <ScrollView style={styles.container}>
      {nonFriends &&
        nonFriends.length > 0 &&
        nonFriends.map((item, index) => (
          <UserList
            key={index}
            user={item}
            onSendFriendReq={onSendFriendReq}
            sentFriendRequest={sentFriendRequest}
            pendingFriendRequests={pendingFriendRequests}
          />
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
});
