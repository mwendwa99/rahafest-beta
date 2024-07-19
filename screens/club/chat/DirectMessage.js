import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { View, StyleSheet } from "react-native";
import { Text } from "../../../components";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDirectMessages,
  sendDirectMessage,
} from "../../../redux/chat/chatActions";

export default function DirectMessage({ route, navigation }) {
  const { directMessages, error, loading } = useSelector((state) => state.chat);
  const [messages, setMessages] = useState([]);
  const { friendDetails } = route.params;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const friendName = `${friendDetails?.first_name} ${friendDetails?.last_name}`;
  const friendId = friendDetails?.id;

  // console.log(messages);

  // Function to transform backend messages to GiftedChat format
  const transformMessagesToGiftedChat = (backendMessages) => {
    return backendMessages.map((msg) => ({
      _id: msg.id,
      createdAt: new Date(msg.timestamp),
      text: msg.content,
      user: {
        _id: msg.sender,
        name: msg.senderName,
      },
    }));
  };

  // Function to transform GiftedChat messages to backend format
  const transformMessageToBackend = (giftedMessage) => {
    return {
      sender: user.id,
      recipient: friendId,
      content: giftedMessage.text,
    };
  };

  // Get current chat messages
  useEffect(() => {
    dispatch(fetchDirectMessages()).then((response) => {
      if (response.payload) {
        const transformedMessages = transformMessagesToGiftedChat(
          response.payload
        );
        setMessages(transformedMessages);
      }
    });
  }, [dispatch]);

  // Send direct message
  const onSend = useCallback(
    (newMessages = []) => {
      const backendMessage = transformMessageToBackend(newMessages[0]);
      dispatch(sendDirectMessage(backendMessage)).then(() => {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, newMessages)
        );
      });
    },
    [dispatch, user.id, friendId]
  );

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text value={` ${friendName}`} variant={"small"} color="#000" />
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user.id,
          name: `${user.first_name} ${user.last_name}`,
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
