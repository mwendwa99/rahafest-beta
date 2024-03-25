import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { View, StyleSheet } from "react-native";
import { Text } from "../../components";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import {
  getDirectMessage,
  postMessage,
  shallowEqual,
} from "../../redux/chat/chatActions";
import { v4 as uuidv4 } from "uuid"; // import uuidv4 function from uuid

export default function DirectMessage({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const {
    user: currentUser,
    token,
    directMessage,
  } = useSelector((state) => ({
    user: state.auth.user,
    token: state.auth.token,
    directMessage: state.chat.directMessage,
    shallowEqual,
  }));
  const dispatch = useDispatch();

  const user = route?.params;

  useEffect(() => {
    if (directMessage) {
      const data = {
        _id: uuidv4(), // generate unique ID for each message
        text: directMessage.content,
        createdAt: new Date(directMessage.timestamp),
        user: {
          _id: directMessage.sender,
          name: directMessage.senderuser,
        },
      };

      setMessages(
        (previousMessages) => GiftedChat.append(previousMessages, [data]) // Wrap data in an array
      );
    }
  }, [directMessage]);

  console.log(directMessage);

  const onSend = useCallback(
    (messages = []) => {
      const messageObject = {
        sender: currentUser?.id,
        content: messages[0].text,
        created_at: messages[0].createdAt,
        message_id: messages[0]._id,
      };
      dispatch(postMessage({ token, message: messageObject }));

      setMessages((previousMessages) =>
        GiftedChat.append(
          previousMessages,
          messages.map((message) => ({
            ...message,
            _id: uuidv4(), // generate unique ID for each message
            user: {
              _id: currentUser?.id,
              name: currentUser?.name,
            },
          }))
        )
      );

      dispatch(getDirectMessage({ token, messageId: route.user._id }));
    },
    [currentUser, token, dispatch]
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

// import React, { useState, useCallback, useEffect } from "react";
// import { GiftedChat } from "react-native-gifted-chat";
// import { View, StyleSheet } from "react-native";
// import { Text } from "../../components";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { StatusBar } from "expo-status-bar";
// import { useDispatch, useSelector, shallowEqual } from "react-redux";
// import { getDirectMessage, postMessage } from "../../redux/chat/chatActions";

// export default function DirectMessage({ route, navigation }) {
//   const [messages, setMessages] = useState([]);
//   const {
//     user: currentUser,
//     token,
//     directMessage,
//   } = useSelector((state) => ({
//     user: state.auth.user,
//     token: state.auth.token,
//     directMessage: state.chat.directMessage,
//     shallowEqual,
//   }));
//   const dispatch = useDispatch();

//   const user = route?.params;

//   console.log(user._id);

//   useEffect(() => {
//     // dispatch(getDirectMessage({ token, messageId: route.params.user._id }));
//     // setMessages([
//     //   {
//     //     _id: 1,
//     //     text: `Hello`,
//     //     createdAt: new Date(),
//     //     user: {
//     //       _id: 2,
//     //       name: "React Native",
//     //       avatar:
//     //         "https://surgassociates.com/wp-content/uploads/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.jpg",
//     //     },
//     //   },
//     // ]);
//   }, [dispatch]); // Dispatch and set messages when directMessage change

//   // set messages based on direct messages object
//   useEffect(() => {
//     if (directMessage) {
//       const data = {
//         _id: directMessage.id,
//         text: directMessage.content,
//         createdAt: directMessage.created_at,
//         user: {
//           _id: directMessage.sender,
//           name: directMessage.senderuser,
//         },
//       };

//       setMessages((previousMessages) =>
//         GiftedChat.append(previousMessages, data)
//       );
//     }
//   }, []);

//   const onSend = useCallback((messages = []) => {
//     const messageObject = {
//       sender: currentUser?.id,
//       content: messages[0].text,
//       created_at: messages[0].createdAt,
//       message_id: messages[0]._id,
//     };
//     dispatch(postMessage({ token, message: messageObject }));

//     setMessages((previousMessages) =>
//       GiftedChat.append(previousMessages, messages)
//     );

//     dispatch(getDirectMessage({ token, messageId: route.params.user._id }));
//   }, []);

//   // const onSend = useCallback((messages = []) => {
//   //   setMessages((previousMessages) =>
//   //     GiftedChat.append(previousMessages, messages)
//   //   );
//   // }, []);

//   // console.log({ directMessage });

//   return (
//     <View style={styles.container}>
//       <View style={styles.center}>
//         <Text
//           value={`Start a conversation with ${user.name}`}
//           variant={"small"}
//           color="#000"
//         />
//       </View>
//       <GiftedChat
//         messages={messages}
//         onSend={(messages) => onSend(messages)}
//         renderSystemMessage={() => {
//           <View>
//             <Text value={"sasa"} color="#000" />
//           </View>;
//         }}
//       />
//       <StatusBar style="light" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   center: {
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 10,
//   },
// });