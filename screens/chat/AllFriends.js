import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/users/usersAction";
import { sendFriendRequest } from "../../redux/friends/friendsActions";
import User from "./components/User";

export default function AllFriends() {
  const { token, user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  // const [users, setUser] = useState([]);
  // console.log("USERS::\t", token);
  useEffect(() => {
    dispatch(getAllUsers(token));
  }, [token]);

  const sendFriendReq = async (selectedUserId) => {
    const userInfo = {
      user: user.id,
      friend: selectedUserId,
      is_accepted: false
    }
    console.log("userInfo::\t", userInfo)
    dispatch(sendFriendRequest(token, userInfo));
  };

  return (
    <ScrollView>
        <View style={{ padding: 10 }}>
            {users ? (
            users.map((item, index) => <User key={index} item={item} token={token} user={user} sendFriendReq={sendFriendReq}/>)
            ) : (
            <Text>No users</Text>
            )}
        </View>
    </ScrollView>
  );
};
