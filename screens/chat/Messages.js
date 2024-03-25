import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, MessageList } from "../../components";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getDirectMessages } from "../../redux/chat/chatActions";

export default function Messages({ navigation }) {
  const { token, user, directMessages } = useSelector(
    (state) => ({
      token: state.auth.token,
      user: state.auth.user,
      directMessages: state.chat.directMessages,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDirectMessages(token));
  }, [dispatch, token]);

  // console.log(user);
  // console.log(directMessages);

  const handleNavigate = (page, user) => {
    // console.log(user);
    navigation.navigate(page, user);
  };

  return (
    <View style={styles.container}>
      {!directMessages ||
        (directMessages.length === 0 && (
          <View style={styles.center}>
            <Text value="You have no message requests" color="#000" />
          </View>
        ))}
      <FlatList
        data={directMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageList message={item} handleNavigate={handleNavigate} />
        )}
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
