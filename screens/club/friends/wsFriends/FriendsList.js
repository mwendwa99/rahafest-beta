import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";

export default function ({ item, setSelectedFriend, ws }) {
  return (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => {
        setSelectedFriend(item.friend);
      }}
    >
      <Avatar.Text
        size={40}
        label={
          item?.friend_slug
            ? item.friend_slug.charAt(0).toUpperCase()
            : item?.user_slug
            ? item.user_slug.charAt(0).toUpperCase()
            : "?" // Fallback label if slug is null, empty, or undefined
        }
        labelStyle={{ fontSize: 20 }}
      />
      <Text style={styles.friendName}>
        {item?.friend_slug
          ? item.friend_slug
          : item?.user_slug
          ? item.user_slug
          : "Anonymous"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  friendName: {
    color: "#fafafa",
    marginLeft: 10,
    fontSize: 16,
  },
});
