import Container from "@/components/Container";
import Typography from "@/components/Typography";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { fetchAllEvents } from "@/store/app/appActions";

// Keep the splash screen visible while we fetch the resources
SplashScreen.preventAutoHideAsync();

export default function EventsPage() {
  const { allEvents, loading, error } = useSelector((state) => state.app);

  useEffect(() => {
    async function prepare() {
      try {
        // If loading is false (meaning events are loaded) or there's an error, hide the splash screen
        if (!loading || error) {
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [loading, error]);

  console.dir(allEvents);

  return (
    <Container style={styles.container}>
      <Typography variant="body1">Yo@</Typography>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#212529",
  },
});
