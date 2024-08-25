import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Avatar, IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  fetchLiveMessages,
  sendLiveMessage,
} from "../../../redux/chat/chatActions";
import { fetchAllUsers } from "../../../redux/auth/authActions";
import { formatDate } from "../../../utils/helper";
import { useNavigation } from "@react-navigation/native";
import { clearError } from "../../../redux/auth/authSlice";

export default function LiveMessages({ sessionId }) {
  const dispatch = useDispatch();
  const { liveMessages, loading } = useSelector((state) => state.chat);
  const [currentMessage, setCurrentMessage] = useState("");
  const user = useSelector((state) => state.auth.user);
  const allUsers = useSelector((state) => state.auth.allUsers);
  const navigation = useNavigation();
  const listRef = useRef(null); // Ref for scrolling

  useEffect(() => {
    dispatch(clearError());
  }, []);

  // If no user is present, redirect to login
  useEffect(() => {
    if (!user) {
      // Handle navigation to login
      navigation.navigate("Login");
    }
  }, [user, navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchAllUsers()).unwrap(),
          dispatch(fetchLiveMessages()).unwrap(),
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    // Poll for new messages every 5 seconds
    const interval = setInterval(() => {
      dispatch(fetchLiveMessages())
        .unwrap()
        .catch((err) => {
          console.error("Failed to fetch messages during polling", err);
        });
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleSubmit = () => {
    if (currentMessage.trim() === "") return;

    const newLiveMessage = {
      sender: user.id,
      content: currentMessage,
    };

    // console.log(newLiveMessage);

    dispatch(sendLiveMessage(newLiveMessage));
    setCurrentMessage("");
  };

  const userMap = allUsers.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollToEnd({ animated: true });
    }
  };

  // Scroll to bottom when liveMessages update
  useEffect(() => {
    scrollToBottom();
  }, [liveMessages]);

  // console.log(liveMessages);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={listRef}
        data={liveMessages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const user = userMap[item?.sender];
          return (
            <View style={styles.messageContainer}>
              <TouchableOpacity
                onPress={() => {
                  /* Handle modal open */
                }}
                disabled
              >
                <Avatar.Text size={40} label={user?.first_name[0]} />
              </TouchableOpacity>
              <View style={styles.messageContent}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center", // Ensures the username and "report" button are aligned vertically
                    width: "95%",
                  }}
                >
                  <Text
                    style={{
                      ...styles.messageSender,
                      // flex: 1, // This makes the username text take up available space
                      width: "auto",
                    }}
                  >
                    {`${user?.first_name} ${user?.last_name}` ||
                      `User ${index + 1}`}
                  </Text>
                  {/* <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    onPress={() =>
                      Linking.openURL("https://support.rahafest.com")
                    }
                  >
                    <MaterialCommunityIcons
                      name="dots-vertical"
                      size={20}
                      color="#d3d3d3"
                      style={{ marginRight: 2 }}
                    />
                  </TouchableOpacity> */}
                </View>

                <Text style={styles.messageText}>{item.content}</Text>
                <Text style={styles.messageTimestamp}>
                  {formatDate(item.timestamp)}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.messageContainer}>
            <Text>No messages</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          placeholderTextColor="#999"
          value={currentMessage}
          onChangeText={setCurrentMessage}
          disabled={loading}
        />
        <IconButton
          mode="contained-tonal"
          icon={loading ? "timer-sand" : "send"}
          size={20}
          onPress={handleSubmit}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 16,
  },
  headerText: {
    fontSize: 24,
    color: "white",
  },
  activeText: {
    fontSize: 16,
    color: "limegreen",
  },
  messageContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  messageContent: {
    marginLeft: 16,
  },
  messageSender: {
    fontWeight: "bold",
    color: "white",
  },
  messageText: {
    color: "white",
  },
  messageTimestamp: {
    fontSize: 12,
    color: "grey",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#2B2B2B",
  },
  input: {
    flex: 1,
    color: "white",
    backgroundColor: "#3B3B3B",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
});
