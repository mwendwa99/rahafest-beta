import { StyleSheet, FlatList, RefreshControl, View, Text } from "react-native";
import { EventCard } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { fetchEvents, fetchTicketTypes } from "../../redux/events/eventActions";
import { ActivityIndicator } from "react-native-paper";
import { clearEventsError } from "../../redux/events/eventSlice";

export default function Events({ navigation }) {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const { user, token } = useSelector((state) => state.auth);
  const [mergedEvents, setMergedEvents] = useState([]);
  const isAuthenticated = !!(user && token);

  // Ref to store the current fetch request's AbortController
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      dispatch(clearEventsError());
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;
      try {
        await dispatch(fetchEvents(controller.signal));
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching events:", err);
        }
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchAndMergeData = async () => {
      if (events.length > 0) {
        const controller = new AbortController();
        const signal = controller.signal;
        try {
          const updatedEvents = await Promise.all(
            events.map(async (event) => {
              if (event.id) {
                // Ensure event.id is not null, undefined, or empty
                const ticketTypesForEvent = await dispatch(
                  fetchTicketTypes(event.id, signal)
                );
                return {
                  ...event,
                  ticketTypes: ticketTypesForEvent.payload || [],
                };
              } else {
                // Handle events without a valid id
                return {
                  ...event,
                  ticketTypes: [],
                };
              }
            })
          );
          setMergedEvents(updatedEvents);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error("Error fetching ticket types:", err);
          }
        }
      }
    };
    fetchAndMergeData();
  }, [events, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchEvents());
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} />
      </View>
    );
  }

  if (error && error.detail !== "No Invoice matches the given query.") {
    return (
      <View style={styles.centered}>
        <Text>Oops! Something went wrong with the server.</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  const handleNavigateToCheckout = (event) => {
    // console.log("Navigating to Checkout with event:", event);
    navigation.navigate("CheckoutNavigator", {
      screen: "Checkout",
      params: { event },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={mergedEvents}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            ticketTypes={item.ticketTypes}
            isAuthenticated={isAuthenticated}
            handleNavigate={handleNavigateToCheckout}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212529",
  },
  contentContainer: {
    flexGrow: 1, // Ensure FlatList takes up available space
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
