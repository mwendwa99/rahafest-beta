import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { View, StyleSheet, StatusBar } from "react-native";
// import { StatusBar } from "expo-status-bar";
import { getAllChats, postMessage } from "../../redux/chat/chatActions";
import { getUser } from "../../redux/auth/authActions";
import { useSelector, useDispatch } from "react-redux";
// import { getRandomNumber } from "../../utils/helper";

export default function Feed({ navigation }) {
  const { allChats } = useSelector((state) => state.chat);
  const { user: currentUser, token } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();

  //guest@rahafest.com
  // console.log(user);

  // console.log(sentMessages);
  // console.log(getRandomNumber());
  // console.log(token);
  // console.log({ allChats });

  useEffect(() => {
    dispatch(getAllChats(token));
  }, [allChats]);

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
            _id: chat.sender,
            name: chat.senderuser,
          },
        };
      });
      setMessages(data);
    }
  }, [allChats]);

  const onSend = useCallback((messages = []) => {
    const messageObject = {
      sender: currentUser?.id,
      content: messages[0].text,
      created_at: messages[0].createdAt,
      message_id: messages[0]._id,
    };
    dispatch(postMessage({ token, message: messageObject }));

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    dispatch(getAllChats(token));
  }, []);

  return (
    <View style={styles.container}>
      <GiftedChat
        isLoadingEarlier={true}
        inverted={false}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        onPressAvatar={(user) => {
          if (user._id === currentUser.id) {
            return false;
          } else {
            navigation.navigate("DirectMessage", { user });
          }
        }}
      />
      <StatusBar barStyle="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 10,
  },
});
