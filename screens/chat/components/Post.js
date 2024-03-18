import { View, Image, Text, Pressable, TouchableOpacity, StyleSheet } from "react-native";

export const Post = ({ index, item, editPost, deletePost }) => {
  const openHandler = () => {
    alert(item.username);
  };

  const openOptions = () => {
    alert("open options");
  };

  const editpost = async () => {
    editPost(item);
  }

  const deletepost = async () => {
    deletePost(item);
  }

  return (
    <Pressable key={index}>
      <View style={feedsStyle.postContainer}>
        <Image style={feedsStyle.thumbnail} source={item?.profileImage} />
        <View style={feedsStyle.content}>
          <View style={feedsStyle.nameContainer}>
            <TouchableOpacity
              onPress={openHandler}
              style={{ display: "flex", flexDirection: "row" }}>
              <Text style={feedsStyle.name}>{item?.senderuser}</Text>
              {/* <Text style={feedsStyle.username}>@{item?.name}</Text> */}
            </TouchableOpacity>
          </View>
          <Text style={feedsStyle.message}>{item?.content}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const feedsStyle = StyleSheet.create({
    postContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      flex: 1,
      maxWidth: "100%",
    },
    thumbnail: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "wheat"
    },
    content: {
      flex: 1,
      marginLeft: 10,
      flexDirection: "column",
    },
    nameContainer: {
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
    },
    name: {
      fontSize: 18,
      fontWeight: "bold",
    },
    username: {
      fontSize: 16,
      color: "gray",
      marginLeft: 10,
    },
    time: {
      flex: 1,
      textAlign: "right",
      marginRight: 20,
    },
    message: {
      marginTop: 5,
      fontSize: 16,
      marginRight: 5,
      maxWidth: "100%",
    },
    feedback: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
  });