import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { StyleSheet } from "react-native";
import { Text } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { getDirectMessages, postMessage } from "../../redux/chat/chatActions";

export default function DirectMessage({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const { user: currentUser, token } = useSelector((state) => state.auth);
  const { directMessages } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const user = route.params.user;

  useEffect(() => {
    dispatch(getDirectMessages({ token, messageId: route.params.user._id }));
    // setMessages([
    //   {
    //     _id: 1,
    //     text: `Hello`,
    //     createdAt: new Date(),
    //     user: {
    //       _id: 2,
    //       name: "React Native",
    //       avatar:
    //         "https://surgassociates.com/wp-content/uploads/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.jpg",
    //     },
    //   },
    // ]);
  }, []); // Dispatch and set messages when directMessages change

  // set messages based on direct messages object
  useEffect(() => {
    if (directMessages) {
      const data = {
        _id: directMessages.id,
        text: directMessages.content,
        createdAt: directMessages.created_at,
        user: {
          _id: directMessages.sender,
          name: directMessages.senderuser,
        },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, data)
      );
    }
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

    dispatch(getDirectMessages({ token, messageId: route.params.user._id }));
  }, []);

  // const onSend = useCallback((messages = []) => {
  //   setMessages((previousMessages) =>
  //     GiftedChat.append(previousMessages, messages)
  //   );
  // }, []);

  // console.log({ directMessages });

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
