import React from "react";
import { View, StyleSheet } from "react-native";
import { useEffect } from "react";
import { fetchUser } from "../../redux/auth/authActions";
import { Text, Button } from "../../components";
import { useSelector, useDispatch } from "react-redux";

export default function Account() {
  const { user, loading, error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  console.log(user);

  return (
    <View style={styles.container}>
      <Text value={`Email: ${user?.email}`} variant={"subtitle"} />
      <Text value={`First Name: ${user?.first_name}`} variant={"subtitle"} />
      <Text value={`Last Name: ${user?.last_name}`} variant={"subtitle"} />
      <Button
        label="Logout"
        variant={"contained"}
        onPress={() => dispatch(logout())}
      />
      <Button
        label="Delete Account"
        variant={"outlined"}
        onPress={() => dispatch(logout())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
});
