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
import { fetchUser } from "../../../redux/auth/authActions";
import { ActivityIndicator } from "react-native-paper";
import { warning } from "../../../utils/toast";
import FriendsPage from "./wsFriends";

export default function Friends({ navigation }) {
  // const [refreshing, setRefreshing] = useState(false);
  // const {
  //   friends,
  //   loading,
  //   nonFriends,
  //   pendingRequests,
  //   sentFriendRequest,
  //   error,
  // } = useSelector((state) => state.friends);
  // const { user } = useSelector((state) => state.auth);
  // const dispatch = useDispatch();

  // // Fetch data when the component mounts or navigation focus changes
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", fetchData);

  //   return unsubscribe;
  // }, [navigation, fetchData]);

  // // Use useCallback to memoize the fetchData function
  // const fetchData = useCallback(async () => {
  //   await dispatch(fetchUser());
  //   await dispatch(fetchFriends());
  //   await dispatch(fetchNonFriends(user));
  //   await dispatch(fetchPendingFriendRequests());
  // }, [dispatch, user]);

  // useEffect(() => {
  //   if (error && error.message === "Permission denied") {
  //     warning("Please login again and try again", 5000);
  //   }
  // }, [error]);

  // // Handle refresh logic
  // const onRefresh = async () => {
  //   setRefreshing(true);
  //   await fetchData();
  //   setRefreshing(false);
  // };

  // if (loading) {
  //   return (
  //     <View style={styles.loader}>
  //       <ActivityIndicator size="large" color="orange" />
  //     </View>
  //   );
  // }

  return (
    <View style={{ flex: 1 }}>
      <FriendsPage />
    </View>
    // <ScrollView
    //   nestedScrollEnabled
    //   style={styles.container}
    //   refreshControl={
    //     <RefreshControl
    //       refreshing={refreshing}
    //       onRefresh={onRefresh}
    //       colors={["#f9a826"]}
    //       progressBackgroundColor={"#fff"}
    //     />
    //   }
    // >
    //   <ScrollView nestedScrollEnabled style={{ maxHeight: 200, width: "100%" }}>
    //     <Text
    //       value={"Your friends"}
    //       variant={"subtitle"}
    //       style={{ textAlign: "center" }}
    //     />
    //     {friends && friends.length > 0 ? (
    //       friends.map((item, index) => (
    //         <AcceptedFriend
    //           navigation={navigation}
    //           key={index}
    //           data={item}
    //           type="message"
    //         />
    //       ))
    //     ) : (
    //       <Text value={"You have no friends"} variant={"body"} />
    //     )}
    //   </ScrollView>

    //   <Text
    //     value={"Add friends"}
    //     variant={"subtitle"}
    //     style={{ textAlign: "center" }}
    //   />

    //   <AllUsers
    //     pendingFriendRequests={pendingRequests}
    //     nonFriends={nonFriends}
    //     sentFriendRequest={sentFriendRequest}
    //   />
    // </ScrollView>
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
