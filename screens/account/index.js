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
import {
  Text,
  Button,
  FriendRequest,
  Input,
  AcceptedFriend,
} from "../../components";
import { ActivityIndicator, Avatar, Divider } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { persistor } from "../../redux/store";

export default function Account({ navigation }) {
  const { user, loading, error } = useSelector((state) => state.auth);
  const {
    friends,
    pendingRequests,
    sentFriendRequest,
    acceptedFriendRequest,
    error: friendError,
  } = useSelector((state) => state.friends);

  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const firstName = user?.first_name || "";
  const lastName = user?.last_name || "";
  const initials = (firstName[0] || "") + (lastName[0] || "");
  const email = user?.email || "";

  const [editFName, setEditFName] = useState(firstName);
  const [editLName, setEditLName] = useState(lastName);
  const [editEmail, setEditEmail] = useState(email);

  // console.log({ acceptedFriendRequest });
  console.log({ friends });

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(fetchUser());
      dispatch(fetchFriends());
      dispatch(fetchPendingFriendRequests());
    });

    return unsubscribe;
  }, [navigation]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleUpdateProfile = () => {
    console.log(editFName, editLName);
    Alert.alert(
      "Coming Soon!", // Title
      "You will be able to update your profile in a future update. Stay tuned!" // Message
    );
  };

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

  const renderPendingRequest = ({ item, index }) => (
    <FriendRequest key={index} data={item} />
  );

  const renderFriend = ({ item, index }) => (
    <AcceptedFriend key={index} data={item} />
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#f9a826"]}
          progressBackgroundColor={"#fff"}
        />
      }
      nestedScrollEnabled
    >
      <View style={styles.container}>
        <Avatar.Text size={100} label={initials} />
        <View
          style={{ alignItems: "center", marginVertical: 10, width: "100%" }}
        >
          {editMode ? (
            <View style={{ alignItems: "center", width: "100%" }}>
              {/* <Input
              onChange={setEditEmail}
              placeholder={"Email"}
              keyboardType="email-address"
              inputMode="email"
              autoComplete="email"
              value={editEmail}
            /> */}
              <Input
                onChange={setEditFName}
                placeholder={"Email"}
                keyboardType="text"
                inputMode="text"
                autoComplete="first name"
                value={editFName}
              />
              <Input
                onChange={setEditLName}
                placeholder={"Last Name"}
                keyboardType="text"
                inputMode="contained"
                mode="flat"
                autoComplete="last name"
                value={editLName}
              />
            </View>
          ) : (
            <View style={{ alignItems: "center" }}>
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
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {editMode && (
              <Button
                label={"Update"}
                variant={"contained"}
                onPress={handleUpdateProfile}
                icon={"update"}
                contentStyle={{ flexDirection: "row-reverse" }}
              />
            )}
            <Button
              label={editMode ? "Cancel" : "Edit Profile"}
              variant={"outlined"}
              onPress={toggleEditMode}
              icon={editMode ? "cancel" : "pencil"}
              contentStyle={{ flexDirection: "row-reverse" }}
            />
          </View>
        </View>
        <View style={styles.column}>
          <Text value={`Friends`} variant={"subtitle"} />
          {pendingRequests && pendingRequests.length > 0 ? (
            <FlatList
              data={pendingRequests}
              renderItem={renderPendingRequest}
              keyExtractor={(item, index) => index}
              ListEmptyComponent={
                <Text value={"You have no pending requests"} variant={"body"} />
              }
              nestedScrollEnabled
            />
          ) : (
            <Text value={"You have no pending requests"} variant={"body"} />
          )}
          <Divider />
          {friends && friends.length > 0 ? (
            <FlatList
              data={friends}
              renderItem={renderFriend}
              keyExtractor={(item, index) => index}
              // horizontal
              ListEmptyComponent={
                <Text value={"You have no friends"} variant={"body"} />
              }
              nestedScrollEnabled
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
    minHeight: 800,
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

// const pendingRequests = [
//   {
//     created_at: "2024-07-17T13:01:38.787402Z",
//     friend: 2,
//     friendDetails: {
//       email: "admin@gmail.com",
//       first_name: "Brian",
//       friendships: [[Object]],
//       id: 2,
//       last_name: "Mwendwa",
//     },
//     id: 2,
//     is_accepted: false,
//     user: 1,
//   },
//   {
//     created_at: "2024-07-17T13:01:38.787402Z",
//     friend: 2,
//     friendDetails: {
//       email: "admin@gmail.com",
//       first_name: "Brian",
//       friendships: [[Object]],
//       id: 2,
//       last_name: "Mwendwa",
//     },
//     id: 2,
//     is_accepted: false,
//     user: 1,
//   },
//   {
//     created_at: "2024-07-17T13:01:38.787402Z",
//     friend: 2,
//     friendDetails: {
//       email: "admin@gmail.com",
//       first_name: "Brian",
//       friendships: [[Object]],
//       id: 2,
//       last_name: "Mwendwa",
//     },
//     id: 2,
//     is_accepted: false,
//     user: 1,
//   },
//   {
//     created_at: "2024-07-17T13:01:38.787402Z",
//     friend: 2,
//     friendDetails: {
//       email: "admin@gmail.com",
//       first_name: "Brian",
//       friendships: [[Object]],
//       id: 2,
//       last_name: "Mwendwa",
//     },
//     id: 2,
//     is_accepted: false,
//     user: 1,
//   },
//   {
//     created_at: "2024-07-17T13:01:38.787402Z",
//     friend: 2,
//     friendDetails: {
//       email: "admin@gmail.com",
//       first_name: "Brian",
//       friendships: [[Object]],
//       id: 2,
//       last_name: "Mwendwa",
//     },
//     id: 2,
//     is_accepted: false,
//     user: 1,
//   },
//   {
//     created_at: "2024-07-17T13:01:38.787402Z",
//     friend: 2,
//     friendDetails: {
//       email: "admin@gmail.com",
//       first_name: "Brian",
//       friendships: [[Object]],
//       id: 2,
//       last_name: "Mwendwa",
//     },
//     id: 2,
//     is_accepted: false,
//     user: 1,
//   },
//   {
//     created_at: "2024-07-17T13:01:38.787402Z",
//     friend: 2,
//     friendDetails: {
//       email: "admin@gmail.com",
//       first_name: "Brian",
//       friendships: [[Object]],
//       id: 2,
//       last_name: "Mwendwa",
//     },
//     id: 2,
//     is_accepted: false,
//     user: 1,
//   },
//   {
//     created_at: "2024-07-17T13:01:38.787402Z",
//     friend: 2,
//     friendDetails: {
//       email: "admin@gmail.com",
//       first_name: "Brian",
//       friendships: [[Object]],
//       id: 2,
//       last_name: "Mwendwa",
//     },
//     id: 2,
//     is_accepted: false,
//     user: 1,
//   },
// ];
