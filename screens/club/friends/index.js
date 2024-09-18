import { View, ScrollView, RefreshControl, StyleSheet } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFriends,
  fetchPendingFriendRequests,
  fetchNonFriends,
} from "../../../redux/friends/friendActions";
import { fetchUser, fetchAllUsers } from "../../../redux/auth/authActions";
import { ActivityIndicator } from "react-native-paper";
import { warning } from "../../../utils/toast";
import FriendsPage from "./wsFriends";

import { clearError } from "../../../redux/auth/authSlice";

export default function Friends({ navigation }) {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, []);

  useEffect(() => {
    dispatch(clearError());
  }, [error]);

  if (error && error.message !== "") {
    console.log("club index page", error);
    // warning(error.message, 2000);
  }

  return (
    <View style={{ flex: 1 }}>
      <FriendsPage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fafafa",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
