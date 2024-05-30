import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { View, StyleSheet } from "react-native";
import { Text } from "../../../components";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { sendDirectMessage } from "../../../redux/chat/chatActions";

export default function DirectMessage({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const {
    user: currentUser,
    token,
    directMessages,
  } = useSelector((state) => ({
    user: state.auth.user,
    token: state.auth.token,
    directMessages: state.chat.directMessages,
  }));
  const dispatch = useDispatch();

  const user = route?.params;

  useEffect(() => {
    // Filter directMessages by recipient and sender
    const allChats = directMessages?.filter(
      (dm) =>
        (dm.recipient === user._id && dm.sender === currentUser?.id) ||
        (dm.recipient === currentUser?.id && dm.sender === user._id)
    );

    if (allChats) {
      // Map directMessages to GiftedChat format
      const data = allChats.map((chat) => ({
        _id: chat.id,
        text: chat.content,
        createdAt: chat.timestamp,
        user: {
          _id: chat.sender === currentUser?.id ? currentUser?.id : chat.sender,
          name: chat.sender === currentUser?.id ? currentUser?.name : user.name,
        },
      }));
      setMessages(data);
    }
  }, [directMessages, currentUser, user._id]); // Update only when directMessages, currentUser, or user._id change

  const onSend = useCallback(
    (newMessages = []) => {
      const newMessage = newMessages[0];
      const messageObject = {
        sender: currentUser?.id,
        content: newMessage.text,
        recipient: user._id,
      };
      dispatch(sendDirectMessage({ token, message: messageObject }));
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );
    },
    [dispatch, token, currentUser, user]
  );

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text
          value={`Start a conversation with ${user.name}`}
          variant={"small"}
          color="#000"
        />
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderSystemMessage={() => {
          <View>
            <Text value={"sasa"} color="#000" />
          </View>;
        }}
        user={{
          _id: currentUser?.id,
          name: currentUser?.name,
        }}
      />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});
