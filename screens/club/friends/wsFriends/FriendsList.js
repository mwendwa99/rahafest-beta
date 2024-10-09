import { useEffect, useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";

export default function ({ item, openDM }) {
  const [title, setTitle] = useState("");
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (item) {
      setTitle(
        item.recipient_id === user.id ? item.sender_slug : item.recipient_slug
      );
    }
  }, [item, user.id]);

  return (
    <TouchableOpacity style={styles.friendItem} onPress={openDM}>
      <Avatar.Text
        size={40}
        label={title?.charAt(0).toUpperCase() || "?"} // Fallback if title is null/empty
        labelStyle={{ fontSize: 20 }}
      />
      <Text style={styles.friendName}>{title || "Anonymous"}</Text>
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
