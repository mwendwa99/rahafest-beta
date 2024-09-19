import { View, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAllUsers } from "../../../redux/auth/authActions";
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
