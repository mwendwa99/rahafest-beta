import React, { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { success } from "../../../src/utils/toast";
import {
  CancelFriendRequest,
  GetFriendRequestSent,
  GetUserFriends,
  SendFriendRequest,
} from "../services/user.service";

const User = ({ index, item, access_token }) => {
  const [requestSent, setRequestSent] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchFriendRequests();
    fetchUserFriends();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const resp = await GetFriendRequestSent(token);
      setFriendRequests(resp);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchUserFriends = async () => {
    try {
      const resp = await GetUserFriends(access_token);
      // console.log("Friends::\t", resp);
      setUserFriends(resp);
    } catch (error) {
      console.log("Error message", error);
    }
  };

  const sendFriendRequest = async (selectedUserId) => {
    try {
      setLoading(true);
      const resp = await SendFriendRequest(access_token, selectedUserId);
      console.log(resp)
      setRequestSent(true);
      // console.log("SEND FRIEND REQ::\t", resp);
    } catch (error) {
      console.log("error message", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelFriendRequest = async () => {
    try {
      setLoading(true);
      const result = await CancelFriendRequest(access_token, item._id);
      success(result.message, 2000);
      setRequestSent(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      fetchFriendRequests();
      fetchUserFriends();
    }
  };
  return (
    <Pressable style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
        <Text style={{ marginTop: 4, color: "gray" }}>{item?.email}</Text>
      </View>
      {userFriends.includes(item._id) ? (
        <Pressable
          style={{
            backgroundColor: "#82CD47",
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}>
          <Text style={{ textAlign: "center", color: "white" }}>Friends</Text>
        </Pressable>
      ) : requestSent || friendRequests.some((friend) => friend._id === item._id) ? (
        <Pressable
          onPress={() => cancelFriendRequest(access_token, item._id)}
          style={{
            backgroundColor: "gray",
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}>
          {/* Conditionally render ActivityIndicator when loading */}
          {loading ? (
            <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
          ) : null}
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>Request Sent</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => sendFriendRequest(item._id)}
          style={{
            backgroundColor: "#567189",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}>
          {/* Conditionally render ActivityIndicator when loading */}
          {loading ? (
            <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
          ) : null}
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>Add Friend</Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default User;
