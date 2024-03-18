import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable, SafeAreaView } from "react-native";
import { GetAcceptedFriends } from "../../services/friends.service";
import { useSelector } from "react-redux";
import UserChat from "./components/UserChat";

export default function Chats () {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const { token } = useSelector((state) =>  state.auth);
  
  useEffect(() => {
    const acceptedFriend = async () => {
      try {
        const friends = await GetAcceptedFriends(token);
        setAcceptedFriends(friends);
      } catch (error) {
        console.log("error showing the accepted friends", error);
      }
    };
    acceptedFriend();
  }, []);

  return (
    <SafeAreaView>
      {acceptedFriends?.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 50 }}>You have no friends to chat with</Text>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable>
          {acceptedFriends?.map((item, index) => (
            <UserChat key={index} item={item} />
          ))}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

