import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import * as SplashScreen from "expo-splash-screen";

import Container from "@/components/Container";
import Typography from "@/components/Typography";
import EventCard from "@/components/Card/EventCard";
import Search from "@/components/Search";

// Keep the splash screen visible while we fetch the resources
SplashScreen.preventAutoHideAsync();

export default function EventsPage() {
  const { allEvents, loading, error } = useSelector((state) => state.app);
  const [searchInput, setSearchInput] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(allEvents);

  useEffect(() => {
    async function prepare() {
      try {
        if (!loading || error) {
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [loading, error]);

  useEffect(() => {
    // Filter events based on the search input
    if (searchInput.trim() === "") {
      setFilteredEvents(allEvents);
    } else {
      const lowercasedInput = searchInput.toLowerCase();
      const filtered = allEvents.filter((event) =>
        event.title.toLowerCase().includes(lowercasedInput)
      );
      setFilteredEvents(filtered);
    }
  }, [searchInput, allEvents]);

  return (
    <Container style={styles.container}>
      <Search
        placeholder="Search events"
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      <FlatList
        data={filteredEvents}
        renderItem={({ item }) => (
          <EventCard
            onPress={() => alert(item.title)}
            key={item?.id}
            image={item?.banner}
          >
            <Typography variant="subtitle1">{item?.title}</Typography>
            <Typography variant="subtitle1">{item?.start_date}</Typography>
            <Typography variant="subtitle1">{item?.end_date}</Typography>
            <Typography variant="subtitle1">{item?.location}</Typography>
          </EventCard>
        )}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    alignItems: "center",
  },
});
