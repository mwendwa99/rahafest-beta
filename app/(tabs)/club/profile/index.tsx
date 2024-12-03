import React from "react";
import Container from "@/components/Container";
import Typography from "@/components/Typography";
import { useAuth } from "@/context/auth";
import Loader from "@/components/Loader";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, StyleSheet } from "react-native";
import Avatar from "@/components/Avatar";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container
      bgColor="#000"
      style={{
        padding: 10,
      }}
    >
      <View style={styles.page}>
        <Avatar names={`${user?.first_name},${user?.last_name}`} />
        <View style={styles.row}>
          <Ionicons name="person-outline" size={24} color={"#fff"} />
          <Typography variant="body1">
            {user?.first_name} {user?.last_name}
          </Typography>
        </View>
        <View style={styles.row}>
          <Ionicons name="mail-outline" size={24} color={"#fff"} />
          <Typography variant="body1">{user?.email}</Typography>
        </View>
        <View style={styles.row}>
          <Ionicons name="call-outline" size={24} color={"#fff"} />
          <Typography variant="body1">{user?.phone}</Typography>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    borderWidth: 1,
    padding: 20,
    borderColor: "#f00",
    borderRadius: 20,
    alignItems: "center",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    marginVertical: 5,
    justifyContent: "space-between",
    borderWidth: 1,
    borderBottomColor: "#c3c3c3",
    padding: 20,
  },
});
