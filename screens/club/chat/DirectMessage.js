import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { View, StyleSheet } from "react-native";
import { Text } from "../../../components";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { sendDirectMessage } from "../../../redux/chat/chatActions";

export default function DirectMessage({ route, navigation }) {
  const [messages, setMessages] = useState([]);

  const onSend = useCallback(() => {
    console.log("sent!");
  }, [dispatch, token, currentUser, user]);

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text
          value={`Start a conversation with name`}
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
        user={{
          _id: currentUser?.id,
          name: currentUser?.name,
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
