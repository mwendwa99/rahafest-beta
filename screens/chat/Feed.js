import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { danger, success } from "../../utils/toast";
import { getAllChats } from "../../redux/chat/chatActions";
import { Post } from "./components/Post";
import { StatusBar } from "expo-status-bar";
import { PostMessage } from "../../services/chat.service";

const splash = require("../../assets/splash.png");
const FeedsScreen = () => {
  const { allChats, loading } = useSelector((state) => state.chat);
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

console.log(allChats)
const [postText, setPostText] = useState("");
  const [charCount, setCharCount] = useState(280);
  const [showPostView, setShowPostView] = useState(false);
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  useLayoutEffect(() => {
    navigation.setOptions({
        headerTitle: "",
        headerLeft: () => <Text style={{ fontSize: 16, fontWeight: "bold" }}>Swift Chat</Text>,
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
            <TouchableOpacity onPress={() => navigation.navigate("Chats")}>
              <Ionicons
                // onPress={() => navigation.navigate("Chats")}
                name="chatbox-ellipses-outline"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => navigation.navigate("Feeds")}>
              <MaterialIcons
                // onPress={() => navigation.navigate("Feeds")}
                name="forum"
                size={24}
                color="#fff"
              />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => navigation.navigate("Friends")}>
              <MaterialIcons
                // onPress={() => navigation.navigate("Friends")}
                name="people-outline"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
            {/* <TouchableOpacity>
              <MaterialIcons onPress={handleLogout} name="logout" size={24} color="black" />
            </TouchableOpacity> */}
          </View>
        ),
      });
  }, []);

  useEffect(() => {
    dispatch(getAllChats(token));
  }, [token]);

  const handlePostTextChange = (text) => {
    setPostText(text);
    setCharCount(280 - text.length);
  };

  const handlePost = async () => {
    console.log("Post:", postText);
    console.log("user:", user);
    // setLoading(true);
    try {
      const postresp = await PostMessage(
        {
          content: postText,
          sender: user.id,
          messageType: "text",
          name: user.name,
        },
        token,
      );
      console.log(postresp);
      closeModal();
    } catch (e) {
      danger("Failed to upload your post!", 2000);
      console.log(e);
    }
  };

  useEffect(() => {
    scrollToBottom();
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ height: "100%" }}>
      < FlatList
        ref={scrollViewRef}
        data={allChats}
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
            <View style={feedsStyle.container}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={feedsStyle.header}>Your post</Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close-circle" size={24} />
                </TouchableOpacity>
              </View>
              <TextInput
                multiline
                placeholder="What's happening?"
                value={postText}
                onChangeText={handlePostTextChange}
                style={feedsStyle.input}
              />
              <Text style={feedsStyle.counter}>{charCount} characters remaining</Text>

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
    </KeyboardAvoidingView>
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

export default FeedsScreen;