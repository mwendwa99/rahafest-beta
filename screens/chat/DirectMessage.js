import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { StyleSheet } from "react-native";
import { Text } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
// import {}
import { getDirectMessages } from "../../redux/chat/chatActions";

export default function DirectMessage() {
  const [messages, setMessages] = useState([]);
  const { directMessages } = useSelector((state) => state.chat);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // console.log("MSG::\t\n", directMessages[0]);
  const user1 = {
    "id": 2,
    "email": "john@example7.com",
    "name": "John"
  }
  useEffect(() => {
    dispatch(getDirectMessages(token));
  }, []);


  // useEffect(() => {
  //   getDM();
  // }, [ ]);

  const getDM = async() => {
    const messages = directMessages?.map(item => {
      let message;
      if(item.sender === user1.id){
        message = {
          _id: 1,
          text: item.content,
          createdAt: new Date(item.timestamp),
          user: {
            _id: 1,
            name: user1.name || "",
            avatar: '',
          },
        };
      } else {
        message = {
          _id: item.id,
          text: item.content,
          createdAt: new Date(item.timestamp),
          user: {
            _id: item.sender,
            name: item.name || "",
            avatar: '',
          },
        };
      }
      return message;
    });
    setMessages(messages);
  };

  const onSend = useCallback((messages = []) => {
    console.log("SENDING::\t",messages)
    const msgObj = {
      sender: user?.id,
      // recipient,
      content: "",
      timestamp: messages[0].createdAt,
      pic: null,
    };
    // dispatch();

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text
        value={"Sender"}
        variant={"subtitle"}
        color="#000"
        textStyle={{
          marginLeft: 20,
          marginTop: -15
        }}
      /> */}
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
