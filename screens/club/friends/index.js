import { View, ScrollView, RefreshControl, StyleSheet } from "react-native";
import { AcceptedFriend, Text } from "../../../components";
import AllUsers from "./AllUsers";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends } from "../../../redux/friends/friendActions";
import { fetchUser } from "../../../redux/auth/authActions";
import { ActivityIndicator } from "react-native-paper";

export default function Friends({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const { friends, loading } = useSelector((state) => state.friends);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(fetchUser());
      dispatch(fetchFriends());
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchUser());
    dispatch(fetchFriends());
    setRefreshing(false);
  };

  // console.log(friends);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  return (
    <ScrollView
      nestedScrollEnabled
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#f9a826"]}
          progressBackgroundColor={"#fff"}
        />
      }
    >
      <ScrollView nestedScrollEnabled style={{ maxHeight: 200, width: "100%" }}>
        <Text
          value={"Your friends"}
          variant={"subtitle"}
          style={{ textAlign: "center" }}
        />
        {friends && friends.length > 0 ? (
          friends.map((item, index) => (
            <AcceptedFriend
              navigation={navigation}
              key={index}
              data={item}
              type="message"
            />
          ))
        ) : (
          <Text value={"You have no friends"} variant={"body"} />
        )}
      </ScrollView>

      <Text
        value={"Add friends"}
        variant={"subtitle"}
        style={{ textAlign: "center" }}
      />

      <AllUsers />
    </ScrollView>
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
