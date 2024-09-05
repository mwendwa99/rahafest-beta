import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native";
import { UserList } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
// import { getUsers } from "../../../redux/chat/chatActions";
import { sendFriendRequest } from "../../../redux/friends/friendActions";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

export default function AllUsers() {
  const { token, user, allUsers } = useSelector((state) => state.auth);
  const { sentFriendRequest } = useSelector((state) => state.friends);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  console.log(allUsers);

  // useEffect(() => {
  //   dispatch(getUsers(token));
  // }, []);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getUsers(token));
    setRefreshing(false);
  };

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
      {allUsers &&
        allUsers.length > 0 &&
        allUsers.map((item, index) => (
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
    // flex: 1,
    backgroundColor: "#fafafa",
  },
});
