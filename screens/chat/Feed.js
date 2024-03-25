import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { View, StyleSheet, StatusBar } from "react-native";
import { getAllChats, postMessage } from "../../redux/chat/chatActions";
import { getUser } from "../../redux/auth/authActions";
import { useSelector, useDispatch } from "react-redux";

export default function Feed({ navigation }) {
  const { allChats } = useSelector((state) => state.chat);
  const { user: currentUser, token } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();

  const onSend = useCallback(
    (newMessages = []) => {
      // Extract the first message from the array
      const newMessage = newMessages[0];

      // Construct the message object
      const messageObject = {
        sender: currentUser?.id,
        content: newMessage.text,
        created_at: newMessage.createdAt,
        message_id: newMessage._id,
      };

      // console.log(messageObject);
      // Dispatch postMessage action to send message to the server
      dispatch(postMessage({ token, message: messageObject }));

      // Update the messages state with the new message appended
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );
    },
    [messages, allChats]
  );

  useEffect(() => {
    // Fetch all chats when component mounts
    dispatch(getUser(token));
  }, [token]);
  useEffect(() => {
    // Fetch all chats when component mounts
    dispatch(getAllChats(token));
  }, [token]);

  // console.log(currentUser);
  //_id: chat.sender === currentUser?.id ? currentUser?.id : chat.sender;
  //currentUser?.id === chat.sender ? 1 : 2

  useEffect(() => {
    // Update messages with data from allChats
    if (allChats) {
      const data = allChats.map((chat, index) => ({
        _id: chat.id,
        text: chat.content,
        createdAt: chat.timestamp,
        user: {
          _id: chat.sender === currentUser?.id ? currentUser?.id : chat.sender,
          name: chat.senderuser,
        },
      }));
      setMessages(data);
      // setMessages((previousMessages) =>
      //   GiftedChat.append(previousMessages, data)
      // );
    }
  }, [allChats]);

  return (
    <View style={styles.container}>
      <GiftedChat
        // isLoadingEarlier={true}
        // listViewProps={{ ref: null }}
        inverted={false}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        onPressAvatar={(user) => {
          if (user._id === currentUser?.id) {
            return false;
          } else {
            navigation.navigate("DirectMessage", { user });
          }
        }}
        user={{
          _id: currentUser?.id,
          name: currentUser?.name,
        }}
      />
      <StatusBar barStyle="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
