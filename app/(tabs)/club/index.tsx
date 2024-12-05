// club/index.tsx
import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/auth";
import Container from "@/components/Container";
import IconButton from "@/components/IconButton";
import Typography from "@/components/Typography";
import NavCard from "@/components/Card/NavCard";

const routes = [
  {
    id: 1,
    icon: "chatbubbles-outline",
    title: "Live Chat",
    link: "club/live",
  },
  {
    id: 2,
    icon: "chatbubble-ellipses-outline",
    title: "Friends",
    link: "club/friends",
  },
  { id: 5, icon: "person-outline", title: "Account", link: "club/profile" },
];

export default function ClubScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();

  // console.log(user);

  return (
    <Container bgColor="#000" padding={20} style={{ paddingTop: 100 }}>
      <View style={styles.btnContainer}>
        <IconButton
          name="log-out-outline"
          size={24}
          title="Logout"
          color="#f00"
          onPress={logout}
        />
      </View>
      <View style={[styles.row, { alignItems: "center" }]}>
        <Typography variant="h5" gutterBottom>
          Hello {user?.first_name}!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome to Raha Club, your exclusive RahaFest companion.
        </Typography>
      </View>
      <View style={styles.row}>
        {routes.map((item, index) => (
          <NavCard
            key={item.id}
            icon={item.icon}
            color={"#F4A329"}
            iconSize={50}
            title={item.title}
            isFullWidth={routes.length % 2 === 1 && index === routes.length - 1}
            onPress={() => router.push(item.link)}
          />
        ))}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  row: {
    marginVertical: 10,
    flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping
    justifyContent: "space-between", // Ensures even spacing
  },
  btnContainer: {
    position: "absolute",
    top: 50,
    right: 20,
  },
});
