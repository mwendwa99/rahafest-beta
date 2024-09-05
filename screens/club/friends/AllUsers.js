import { StyleSheet, View, ScrollView } from "react-native";
import { UserList } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import {
  sendFriendRequest,
  fetchNonFriends,
} from "../../../redux/friends/friendActions";
import { useEffect } from "react";

export default function AllUsers() {
  const { token, user, allUsers } = useSelector((state) => state.auth);
  const { sentFriendRequest, nonFriends, loading } = useSelector(
    (state) => state.friends
  );
  const dispatch = useDispatch();

  // console.log(nonFriends);

  useEffect(() => {
    const currentUser = user;
    dispatch(fetchNonFriends(currentUser));
  }, []);

  // console.log(allUsers);

  const onSendFriendReq = (sendId) => {
    const data = {
      user: user.id,
      friend: sendId,
      is_accepted: false,
    };
    // console.log(data);
    dispatch(sendFriendRequest({ token, data }));
  };

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
