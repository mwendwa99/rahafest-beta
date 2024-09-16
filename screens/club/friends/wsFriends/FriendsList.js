import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";

export default function ({ item, setSelectedFriend, ws }) {
  return (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => {
        setSelectedFriend(item.friend);
        ws.current.send(
          JSON.stringify({
            action: "dm-list",
            friendId: item.friend,
          })
        );
      }}
    >
      <Avatar.Text
        size={40}
        label={item.friend_user_slug.charAt(0)}
        labelStyle={{ fontSize: 20 }}
      />
      <Text style={styles.friendName}>{item.friend_user_slug}</Text>
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
