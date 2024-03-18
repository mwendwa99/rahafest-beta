import { useEffect, useState } from "react";
import { GetUsersApi } from "../../services/user.service";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";

export default function AllFriends() {
  const { token } = useSelector((state) => state.auth);
  const [users, setUser] = useState([]);
  console.log(token)
  useEffect(() => {
    const fetchUsers = async () => {
        const users = await GetUsersApi(token);
        setUser(users);
        console.log(users);
    }
    fetchUsers();
  }, []);

  return (
    <ScrollView>
        <View style={{ padding: 10 }}>
            {users ? (
            users.map((item, index) => <User key={index} item={item} access_token={access_token}/>)
            ) : (
            <Text>No users</Text>
            )}
        </View>
    </ScrollView>
  );
};
