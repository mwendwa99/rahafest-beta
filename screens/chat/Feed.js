import { Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  View,
  TextInput,
  FlatList,
  Platform,
  Button,
  Pressable,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useSelector } from "react-redux";
import { danger, success } from "../../utils/toast";

const FeedsScreen = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  const [postText, setPostText] = useState("");
  const [charCount, setCharCount] = useState(280); // Twitter's character limit
  const [showPostView, setShowPostView] = useState(false);
  const [loading, setLoading] = useState(false);
  const { access_token, user } = useSelector((state) => state.auth);

  const handlePostTextChange = (text) => {
    setPostText(text);
    setCharCount(280 - text.length);
  };

  const handlePost = async () => {
    console.log("Post:", postText);
    setLoading(true);
    try {
      const postresp = await SendPost(
        {
          messageText: postText,
          senderId: userId,
          messageType: "text",
          name: user.name,
        },
        access_token,
      );
      console.log(postresp);
      closeModal();
      fetchAllMessages();
    } catch (e) {
      danger("Failed to upload your post!", 2000);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const fetchAllMessages = async () => {
    try {
      const res = await GetPosts(access_token);
      setMessages(res);
      console.log(res[0]);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchAllMessages();
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
              // onPress={() => navigation.goBack()}
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
      await DeletePost(access_token);
      fetchAllMessages();
      success("Deleted the post", 3000);
    } catch (e) {
      console.log(e);
      danger("Failed to delete the post", 3000);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ height: "100%" }}>
      <FlatList
        ref={scrollViewRef}
        data={messages}
        renderItem={({ item, index }) => (
          <Post
            index={index}
            item={item}
            editPost={editPost}
            deletePost={deletePost}
            handleLike={handleLike}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Pressable style={feedsStyle.createPostPressable} onPress={openPost}>
        <TouchableOpacity onPress={openPost}>
          <Ionicons name="create" size={54} color="salmon" />
        </TouchableOpacity>
      </Pressable>

      {showPostView && (
        <View
          style={{
            position: "absolute",
            minHeight: 400,
            minWidth: "100%",
            top: "20%",
            // backgroundColor: "wheat",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}>
          <View
            style={{
              position: "relative",
              width: "93%",
              height: "90%",
              backgroundColor: "#fff",
              borderRadius: 20,
            }}>
            <View style={styles.container}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.header}>Your post</Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close-circle" size={24} />
                </TouchableOpacity>
              </View>
              <TextInput
                multiline
                placeholder="What's happening?"
                value={postText}
                onChangeText={handlePostTextChange}
                style={styles.input}
              />
              <Text style={styles.counter}>{charCount} characters remaining</Text>

              {/* Image Upload (optional) */}
              {/* Implement image upload functionality if needed */}

              {loading ? (
                <ActivityIndicator size="small" color="blue" style={{ marginRight: 10 }} />
              ) : (
                <Button title="Post" onPress={handlePost} disabled={postText.length === 0} />
              )}
            </View>
          </View>
        </View>
      )}
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 25,
          bottom: 0,
        }}>
        <Entypo
          onPress={handleEmojiPress}
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color="gray"
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type Your message..."
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}> */}
      {/* <Entypo onPress={pickImage} name="camera" size={24} color="gray" /> */}
      {/* </View> */}
      {/* </View> */}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    // Header styles
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
});

export default FeedsScreen;