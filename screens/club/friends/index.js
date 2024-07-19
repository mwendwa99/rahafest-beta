import {
  FlatList,
  SafeAreaView,
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { AcceptedFriend, Text } from "../../../components";
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingFriendRequests } from "../../../redux/friends/friendActions";
import { fetchFriends } from "../../../redux/friends/friendActions";
import { fetchUser } from "../../../redux/auth/authActions";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
// const scrollViewRef = useRef(null);

export default function Friends({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const { friends, loading } = useSelector((state) => state.friends);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // const navigation = useNavigation();

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
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#f9a826"]}
          progressBackgroundColor={"#fff"}
        />
      }
    >
      <View style={styles.container}>
        <ScrollView
          nestedScrollEnabled
          style={{ maxHeight: 200, width: "100%" }}
        >
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
        {/* {friends && friends.length > 0 ? (
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
        )} */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
