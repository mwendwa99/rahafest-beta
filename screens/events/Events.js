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
import EventList from "../../components/EventList";
import { formatEventDates } from "../../utils/helper";
import api from "../../services/api.service";

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
  const [events, setEvents] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState({ upcoming: false, past: false });
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch 5 events for the specified type once.
  async function fetchEvents(type = "upcoming") {
    setLoading((prev) => ({ ...prev, [type]: true }));
    setError(null);
    try {
      const baseUrl = "public/events/list?page_size=5&is_active=1";
      const upcomingParam =
        type === "upcoming" ? "&upcoming=true" : "&upcoming=false";
      const url = `${baseUrl}${upcomingParam}`;
      const response = await api.get(url);
      const newEvents = response.data.data.items;
      setEvents((prev) => ({
        ...prev,
        [type]: newEvents,
      }));
    } catch (err) {
      console.log(JSON.stringify(err));
      const funMessage = getRandomErrorMessage();
      setError(funMessage);
      setTimeout(() => {
        setError(null);
      }, 5000); // Error message disappears after 3 seconds
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  }

  // Initial load: fetch both upcoming and past events (each 5 items)
  useEffect(() => {
    fetchEvents("upcoming");
    fetchEvents("past");
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchEvents("upcoming"), fetchEvents("past")]);
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
        tickets={item?.ticket_types || []}
        // onPress={() =>
        //   navigation.navigate("CheckoutNavigator", {
        //     screen: "Checkout",
        //     params: { event: item, showDiscount: false },
        //   })
        // }
        onPress={() =>
          navigation.navigate("Event", {
            params: { title: item.title },
          })
        }
        isActive={item?.is_active}
        hideDiscounted
      />
    ),
    [navigation]
  );

  // Render each section without infinite scroll (no onEndReached)
  const renderSection = useCallback(
    (type) => {
      if (!events[type].length) return null;
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {type === "upcoming" ? "Upcoming Events" : "Past Events"}
          </Text>
          <FlatList
            data={events[type]}
            renderItem={renderEventItem}
            keyExtractor={(item) => item?.id?.toString()}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            windowSize={5}
            initialNumToRender={5}
          />
        </View>
      );
    },
    [events, renderEventItem]
  );

  if (
    loading.upcoming &&
    loading.past &&
    !events.upcoming.length &&
    !events.past.length
  ) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#B41818" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        ListHeaderComponent={renderSection("upcoming")}
        ListFooterComponent={renderSection("past")}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#B41818"]}
          />
        }
        data={[]} // using header/footer for sections only
        renderItem={null}
        showsVerticalScrollIndicator={false}
      />
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
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
