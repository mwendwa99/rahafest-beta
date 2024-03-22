import { useNavigation } from "@react-navigation/native";
import { GiftedChat } from "react-native-gifted-chat";
import { View, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
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
  }, []);

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
              color="#fff"
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 10,
  },
});