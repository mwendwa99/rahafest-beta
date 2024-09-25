import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { formatTimestamp } from "../../../../utils/helper";

export default function PendingFriends({
  item,
  acceptFriendRequest,
  rejectFriendRequest,
}) {
  const { user } = useSelector((state) => state.auth || {});

  // console.log(item);

  const id = user.id;

  // Memoized check for user's ID comparison
  const isRequester = useMemo(() => id !== item.user, [id, item.user]);

  // console.log(isRequester, item.user);

  return isRequester ? (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>
        {item.friend_slug || "Anonymous"} wants to be your friend
      </Text>
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={acceptFriendRequest}
      >
        <Text style={styles.buttonText}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.rejectButton}
        onPress={() => rejectFriendRequest(item.id)}
      >
        <Text style={styles.buttonText}>Reject</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>
        Friend request sent to {item.friend_slug || "Anonymous"} on{" "}
        {formatTimestamp(item?.created_at)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  requestText: {
    color: "#fafafa",
    flex: 1,
  },
  acceptButton: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  rejectButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fafafa",
  },
});
