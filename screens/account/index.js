import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  deleteAccount,
  fetchUser,
  updateUser,
} from "../../store/auth/authActions";
import { Text, Button, Input } from "../../components";
import { ActivityIndicator, Avatar } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { persistor } from "../../store";
import { success } from "../../utils/toast";

export default function Account({ navigation }) {
  const { user, loading, error } = useSelector((state) => state.auth);

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

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(fetchUser());
    });

    return unsubscribe;
  }, [navigation]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleUpdateProfile = () => {
    dispatch(
      updateUser({
        first_name: editFName,
        last_name: editLName,
      })
    );

    setEditMode(false);
  };

  const handleLogout = () => {
    persistor.purge();
    success("You have been logged out");
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
            dispatch(deleteAccount());
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

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchUser()).finally(() => setRefreshing(false));
  };

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
        <Avatar.Text
          size={100}
          color="#fff"
          label={initials}
          style={{
            backgroundColor: "#f9a826",
          }}
        />
        <View
          style={{ alignItems: "center", marginVertical: 10, width: "100%" }}
        >
          {editMode ? (
            <View style={{ alignItems: "center", width: "100%" }}>
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
              variant={"contained"}
              onPress={toggleEditMode}
              icon={editMode ? "cancel" : "pencil"}
              color="#F4A329"
              contentStyle={{
                flexDirection: "row-reverse",
                backgroundColor: "#212529",
                color: "#F4A329",
              }}
            />
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => alert("Wallet feature coming soon!")}
          >
            <Image
              source={require("../../assets/wallet-card.png")}
              style={styles.walletCard}
              height={150}
              // width={300}
            />
          </TouchableOpacity>
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
    height: 400,
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
  walletCard: {
    width: 360,
    height: 150,
    borderRadius: 10,
    marginVertical: 10,
    objectFit: "contain",
  },
});
