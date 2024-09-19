import React, { useEffect, useRef } from "react";
import { StyleSheet, TextInput, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { useNavigation } from "@react-navigation/native";
import { clearError } from "../../../redux/auth/authSlice";
import WebSocketChat from "./wsChat";

export default function LiveMessages({ sessionId }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
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

  return (
    <SafeAreaView style={styles.container}>
      <WebSocketChat />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
