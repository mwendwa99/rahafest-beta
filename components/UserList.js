import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import Text from "./Text";
import Button from "./Button";

const UserList = memo(({
  user,
  handleSendFriendRequest,
  sentFriendRequest,
  pendingFriendRequests = [],
}) => {
  const isPending = React.useMemo(() => 
    Array.isArray(pendingFriendRequests) &&
    pendingFriendRequests.some((request) => request.friend === user.id),
    [pendingFriendRequests, user.id]
  );

  const userSlug = user?.friend_user_slug || user?.user_slug || "Anonymous";
  const avatarLabel = userSlug.charAt(0).toUpperCase() || "?";

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Avatar.Text
          style={styles.avatar}
          size={30}
          label={avatarLabel}
        />
        <View style={styles.column}>
          <Text
            value={userSlug}
            style={styles.userText}
            variant="body"
          />
        </View>
      </View>
      <Button
        onPress={handleSendFriendRequest}
        disabled={
          (sentFriendRequest && sentFriendRequest.friend === user.id) ||
          isPending
        }
        color={
          sentFriendRequest && sentFriendRequest.friend === user.id
            ? "gray"
            : "orange"
        }
        label="add"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    height: 70, // Fixed height for getItemLayout
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
  },
  avatar: {
    marginRight: 10,
  },
  userText: {
    color: "#fafafa",
  },
});

export default UserList;