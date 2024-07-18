import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  RefreshControl,
  FlatList,
  ScrollView,
} from "react-native";
import { fetchUser } from "../../redux/auth/authActions";
import {
  fetchFriends,
  fetchPendingFriendRequests,
} from "../../redux/friends/friendActions";
import { Text, Button, FriendRequest } from "../../components";
import { ActivityIndicator, Avatar, Divider } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { persistor } from "../../redux/store";

export default function Account({ navigation }) {
  const { user, loading, error } = useSelector((state) => state.auth);
  const {
    friends,
    pendingRequests,
    sentFriendRequest,
    error: friendError,
  } = useSelector((state) => state.friends);

  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const firstName = user?.["first_name"] || "";
  const lastName = user?.["last_name"] || "";
  const initials = (firstName[0] || "") + (lastName[0] || "");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(fetchUser());
      dispatch(fetchFriends());
      dispatch(fetchPendingFriendRequests());
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchUser());
    dispatch(fetchFriends());
    dispatch(fetchPendingFriendRequests()).finally(() => setRefreshing(false));
  };

  const handleLogout = () => {
    persistor.purge();
    console.info("You have been logged out");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Are you sure you want to delete your account?", // Title
      "This action cannot be undone.", // Message
      [
        {
          text: "Yes",
          onPress: () => {
            // dispatch(deleteAccount());
            console.log("Account deleted");
          },
        },
        {
          text: "No",
          onPress: () => {
            console.log("Account not deleted");
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  const renderPendingRequest = ({ item }) => (
    <FriendRequest key={item.id} data={item} />
  );
  const renderFriend = ({ item }) => (
    <Text key={item.email} value={item.email} variant={"body"} />
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Avatar.Text size={100} label={initials} />
      <View style={{ alignItems: "center", marginVertical: 10 }}>
        <Text
          value={` ${user?.email}`}
          variant={"body"}
          style={{ fontWeight: 700 }}
        />
        <Text
          value={` ${user?.first_name} ${user?.last_name}`}
          variant={"body"}
          style={{ fontWeight: 700 }}
        />
        <Button
          label="Edit Profile"
          variant={"outlined"}
          onPress={() => {}}
          icon="pencil"
          contentStyle={{ flexDirection: "row-reverse" }}
        />
      </View>
      <View style={styles.column}>
        <Text value={`Friends`} variant={"subtitle"} />
        {pendingRequests && pendingRequests.length > 0 ? (
          <FlatList
            data={pendingRequests}
            renderItem={renderPendingRequest}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <Text value={"You have no pending requests"} variant={"body"} />
        )}
        <Divider />
        {friends && friends.length > 0 ? (
          <FlatList
            data={friends}
            renderItem={renderFriend}
            keyExtractor={(item) => item.email}
          />
        ) : (
          <Text value={"You have no friends"} variant={"body"} />
        )}
      </View>
      <View style={styles.button}>
        <Button
          label="Logout"
          variant={"contained"}
          onPress={handleLogout}
          icon="logout"
          contentStyle={{ flexDirection: "row-reverse" }}
        />
        <Button
          label="Delete Account"
          variant={"outlined"}
          onPress={handleDeleteAccount}
          icon="delete"
          contentStyle={{ flexDirection: "row-reverse" }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    margin: 20,
    padding: 20,
  },
  column: {
    alignSelf: "flex-start",
    backgroundColor: "#fafafa",
    padding: 10,
    borderRadius: 5,
    elevation: 1,
    height: "100%",
    maxHeight: 300,
    width: "100%",
  },
  button: {
    marginTop: 20,
    width: "100%",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
