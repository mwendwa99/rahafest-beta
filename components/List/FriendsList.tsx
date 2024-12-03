import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Avatar from "../Avatar";
import Typography from "../Typography";
import { useAuth } from "@/context/auth";

interface FriendsListProps {
  data: {
    id: number;
    recipient_slug: string;
    sender_slug: string;
    recipient_id: number;
  };
  handleOpenDM: () => void;
}

export default function FriendsList({ data, handleOpenDM }: FriendsListProps) {
  const [title, setTitle] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (data) {
      setTitle(
        data?.recipient_id === user?.id
          ? data?.sender_slug
          : data?.recipient_slug
      );
    }
  }, [data, user?.id]);

  return (
    <TouchableOpacity style={styles.friendItem} onPress={handleOpenDM}>
      <Avatar names={title} />
      <Typography style={styles.friendName}>{title || "Anonymous"}</Typography>
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
