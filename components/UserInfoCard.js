import { StyleSheet, View } from "react-native";
import React from "react";

import Text from "./Text";

const UserInfoCard = ({ loading, user, phone }) => {
  return (
    <View>
      {loading && (
        <Text value="Getting your information, please wait" variant="body" />
      )}
      <Text value="Your Information" variant="body" />
      <View
        style={{
          ...styles.container,
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Text
          value={`name: ${user?.first_name} ${user?.last_name}`}
          variant="body"
          style={{ color: "grey" }}
        />
        <Text
          value={`mobile: ${user?.phone || phone || "unavailable"}`}
          variant="body"
          style={{ color: "grey" }}
        />
        <Text
          value={`email: ${user?.email}`}
          variant="body"
          style={{ color: "grey" }}
        />
      </View>
    </View>
  );
};

export default UserInfoCard;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 5,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
