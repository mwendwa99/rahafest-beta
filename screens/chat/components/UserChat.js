import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, View, Pressable, Image } from "react-native";
import { useSelector } from "react-redux";
import { FetchUserMessages } from "../../../services/chat.service";


const UserChat = ({ item }) => {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const { token } = useSelector((state) => state.auth);

  const fetchMessages = async () => {
    try {
      const res = await FetchUserMessages(token, item._id);
      setMessages(res);
    } catch (error) {
      console.log("error fetching messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  // console.log(messages);

  const getLastMessage = () => {
    const userMessages = messages.filter((message) => message.messageType === "text");

    const n = userMessages.length;

    return userMessages[n - 1];
  };
  const lastMessage = getLastMessage();
  // console.log(lastMessage);
  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };
  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Messages", {
          recepientId: item._id,
        })
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 0.7,
        borderColor: "#D0D0D0",
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
      }}>
      <Image
        style={{
          width: 50,
          height: 50,
          backgroundColor: "wheat",
          borderRadius: 25,
          resizeMode: "cover",
        }}
        source={{ uri: item?.image }}
      />

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>{item?.name}</Text>
        {lastMessage && (
          <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>
            {lastMessage?.message}
          </Text>
        )}
      </View>

      <View>
        <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>
          {lastMessage && formatTime(lastMessage?.timeStamp)}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserChat;
