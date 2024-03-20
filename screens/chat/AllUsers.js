import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import { UserList } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../redux/chat/chatActions";
import { sendFriendRequest } from "../../redux/friends/friendActions";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

export default function AllUsers() {
  const { token, user } = useSelector((state) => state.auth);
  const { users, loading } = useSelector((state) => state.chat);
  const { friendRequests } = useSelector((state) => state.friends);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  console.log(users);

  useEffect(() => {
    dispatch(getUsers(token));
  }, []);

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
    dispatch(sendFriendRequest({ token, data }));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserList
            user={item}
            onSendFriendReq={onSendFriendReq}
            requestedFriend={friendRequests}
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
