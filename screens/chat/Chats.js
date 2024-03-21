import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable, SafeAreaView } from "react-native";
import { getFriends } from "../../redux/friends/friendActions";
import { useDispatch, useSelector } from "react-redux";
import UserChat from "./components/UserChat";

export default function Chats () {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const { token } = useSelector((state) =>  state.auth);
  const { friends } = useSelector((state) => state.friend);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getFriends(token));
  }, []);

  return (
    <SafeAreaView>
      {friends?.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 50 }}>You have no friends to chat with</Text>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable>
          {friends?.map((item, index) => (
            <UserChat key={index} item={item} />
          ))}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

