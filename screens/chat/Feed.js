import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { View, StyleSheet } from "react-native";
import { Text } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getAllChats, postMessage } from "../../redux/chat/chatActions";
import { getUser } from "../../redux/auth/authActions";
import { useSelector, useDispatch } from "react-redux";
import { getRandomNumber } from "../../utils/helper";

export default function Feed() {
  const { allChats, sentMessages } = useSelector((state) => state.chat);
  const { user, token } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();

  console.log(sentMessages);
  console.log(getRandomNumber());

  useEffect(() => {
    dispatch(getAllChats(token));
  }, []);

  useEffect(() => {
    dispatch(getUser(token));
  }, []);

  useEffect(() => {
    // ]);
    // // update messages with data from allChats
    if (allChats) {
      const data = allChats?.map((chat) => {
        return {
          _id: chat.id,
          text: chat.content,
          user: {
            _id: chat.senderuser,
            name: chat.senderuser,
          },
        };
      });
      setMessages(data);
    }
  }, [allChats]);

  const onSend = useCallback((messages = []) => {
    const result = dispatch(
      postMessage(token, {
        sender: user?.id || 3,
        content: messages[0].text,
        created_at: messages[0].createdAt,
        message_id: messages[0]._id,
      })
    );

    // console.log(messages);
    console.log(result);
    // setMessages((previousMessages) => {
    //   GiftedChat.append(previousMessages, messages);
    //   // dispatch(postMessage(token, messages));
    // });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text value={"Feed"} variant={"subtitle"} color="#000" />
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
