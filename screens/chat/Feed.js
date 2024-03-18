import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { View, StyleSheet } from "react-native";
import { Text } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getAllChats } from "../../redux/chat/chatActions";
import { useSelector, useDispatch } from "react-redux";

export default function Feed() {
  const { allChats } = useSelector((state) => state.chat);
  const { token } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();

  console.log(allChats);

  useEffect(() => {
    dispatch(getAllChats(token));
  }, []);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
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
