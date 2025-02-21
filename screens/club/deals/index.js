// Events.js
import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventList from "../../../components/EventList";
import { formatEventDates } from "../../../utils/helper";
import api from "../../../services/api.service";

const FUN_ERROR_MESSAGES = [
  "Oops! Let's try again!",
  "Uh oh! Give it another shot!",
  "Looks like the events are taking a coffee break. Refresh to wake them up!",
  "Whoops! Try again!",
  "Darn it! We tripped over a wire fetching events. Let's reload!",
];

function getRandomErrorMessage() {
  return FUN_ERROR_MESSAGES[
    Math.floor(Math.random() * FUN_ERROR_MESSAGES.length)
  ];
}

export default function Events({ navigation }) {
  const [events, setEvents] = useState([]); // Single array for events
  const [loading, setLoading] = useState(false); // Single loading state
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch events with VIP tickets
  async function fetchEvents() {
    setLoading(true);
    setError(null);
    try {
      // Modify API endpoint to fetch events that have at least one VIP ticket
      const url = `public/events/list?page_size=100`; // Adjust page_size as needed
      const response = await api.get(url);
      let allEvents = response.data.data.items;

      // Filter events to only include those with at least one VIP ticket type
      const vipEvents = allEvents.filter((event) => {
        return (
          !event.is_expired &&
          event.ticket_types.some((ticket) => ticket.is_rahaclub_vip === true)
        );
      });
      setEvents(vipEvents); // Set the filtered events
    } catch (err) {
      console.log(JSON.stringify(err));
      const funMessage = getRandomErrorMessage();
      setError(funMessage);
      setTimeout(() => {
        setError(null);
      }, 5000); // Error message disappears after 5 seconds
    } finally {
      setLoading(false);
    }
  }

  // Initial load: fetch VIP events
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, []);

  const renderEventItem = useCallback(
    ({ item }) => (
      <EventList
        id={item?.id?.toString()}
        title={item?.title}
        subtitle={item?.event_organizer?.organization_name}
        image={item?.banner}
        date={formatEventDates(item?.start_date, item?.end_date)}
        location={item?.venue}
        expired={!item?.is_active || item?.is_expired}
        tickets={item?.ticket_types || []} // Pass all ticket types for now - filtering will happen in EventScreen
        onPress={() =>
          navigation.navigate("EventDeal", {
            params: { title: item.title },
          })
        }
        isActive={item?.is_active}
        hideDiscounted
      />
    ),
    [navigation]
  );

  if (loading && !events.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#B41818" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <FlatList
        data={events} // Use the single 'events' array
        renderItem={renderEventItem}
        keyExtractor={(item) => item?.id?.toString()}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={5}
        initialNumToRender={5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#B41818"]}
          />
        }
        ListEmptyComponent={() =>
          !loading ? (
            <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
              No active deals found please check again later!
            </Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    paddingHorizontal: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  errorContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#ff0000aa",
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "white",
    textAlign: "center",
  },
});
