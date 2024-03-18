import { GiftedChat } from "react-native-gifted-chat";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { getAllChats, postMessage } from "../../redux/chat/chatActions";
import { getUser } from "../../redux/auth/authActions";
import { useSelector, useDispatch } from "react-redux";
import { getRandomNumber } from "../../utils/helper";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";

export default function FeedS() {
  const { allChats } = useSelector((state) => state.chat);
  const { user, token } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();

  // console.log(sentMessages);
  // console.log(getRandomNumber());

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
    const messageObject = {
      sender: user?.id || getRandomNumber(),
      content: messages[0].text,
      created_at: messages[0].createdAt,
      message_id: messages[0]._id,
    };
    dispatch(postMessage({ token, message: messageObject }));

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    // dispatch(getAllChats(token));
  }, []);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  const handleSizeContentChange = () => {
    scrollToBottom();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Your feeds",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginRight: 20 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      ),
    });
  });

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const handleLike = (text) => {
    // alert(text);
  };

  const openPost = () => {
    setShowPostView(true);
  };

  const closeModal = () => {
    setShowPostView(false);
    setPostText("");
    setCharCount(280);
  };

  const editPost = (post) => {
    setShowPostView(true);
    setPostText(post.message);
  };

  const deletePost = async (post) => {
    try {
      const { _id, senderId } = post;
      await DeletePost(token);
    //   fetchAllMessages();
      success("Deleted the post", 3000);
    } catch (e) {
      console.log(e);
      danger("Failed to delete the post", 3000);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text value={"Feed"} variant={"subtitle"} color="#000" /> */}
      <GiftedChat
        inverted={false}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
      <StatusBar style="light" />
    </View>
  );
};

const feedsStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    minHeight: 150,
  },
  counter: {
    alignSelf: "flex-end",
    marginBottom: 10,
    color: "#666",
  },
  createPostPressable: {
    position: "absolute",
    bottom: 10,
    right: 35,
    backgroundColor: "purple",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
});