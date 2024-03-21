import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import { UserList } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../redux/chat/chatActions";
import { getFriendsRequests, sendFriendRequest, rejectFriendRequest } from "../../redux/friends/friendActions";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

export default function AllUsers() {
  const { token, user } = useSelector((state) => state.auth);
  const { users, loading } = useSelector((state) => state.chat);
  const { sentFriendRequest } = useSelector((state) => state.friends);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  // console.log("Req::\t",sentFriendRequest);

  useEffect(() => {
    dispatch(getUsers(token));
  }, []);

  useEffect(() => {
    dispatch(getFriendsRequests(token));
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getUsers(token));
    setRefreshing(false);
  };

  const onSendFriendReq = (sendId) => {
    users.map(item => {
      // console.log("FriendId::\t", item.id)
      if (item.id === sendId) {
        const data = {
          user: user.id,
          friend: sendId,
          is_accepted: false,
        };
        console.log("Sending now::\t",sendId);
        // console.log("Sending data::\t",data);
        dispatch(sendFriendRequest({ token, data }));
        return;
      };
    });
  };

  const cancelRequest = (sendId) => {
    users.map(item => {
      // console.log("FriendId::\t", item.id)
      if (item.id === sendId) {
        const data = {
          user: user.id,
          friend: sendId,
          is_accepted: false,
        };
        console.log("Sending now::\t",sendId);
        dispatch(rejectFriendRequest({ token, data }));
        return;
      };
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserList
            allUsers={item}
            onSendFriendReq={onSendFriendReq}
            cancelRequest={cancelRequest}
            sentFriendRequest={sentFriendRequest}
            user={user}
          />
        )}
        ListEmptyComponent={() => <ActivityIndicator />}
        RefreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fafafa",
  },
});
