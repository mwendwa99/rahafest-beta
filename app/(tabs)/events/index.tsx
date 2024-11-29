import React, { useEffect, useState, useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Container from "@/components/Container";
import Typography from "@/components/Typography";
import EventCard from "@/components/Card/EventCard";
import Search from "@/components/Search";
import Loader from "@/components/Loader";
import { formatEventDates, formatTime } from "@/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { fetchAllEvents } from "@/store/app/appActions";

export default function EventsPage() {
  const { allEvents, loading, error } = useSelector((state) => state.app);
  const [searchInput, setSearchInput] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(allEvents);
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchAllEvents());
    setRefreshing(false);
  }, [allEvents]);

  if (loading) {
    return <Loader />;
  }

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
            <Typography variant="body2" color="#c3c3c3">
              {formatEventDates(item?.start_date, item?.end_date)}
            </Typography>
            <View style={{ flexDirection: "row" }}>
              <Ionicons name="location-outline" size={20} color={"#FE1648"} />
              <Typography variant="subtitle1">{item?.location}</Typography>
            </View>
          </EventCard>
        )}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
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
