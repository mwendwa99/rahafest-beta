import { View, ScrollView, RefreshControl, StyleSheet } from "react-native";
import { AcceptedFriend, Text } from "../../../components";
import AllUsers from "./AllUsers";
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

export default function Friends({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, []);

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
