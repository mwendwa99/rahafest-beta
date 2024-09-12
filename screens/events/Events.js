import {
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  Text as RNText,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { EventCard, Text } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef, useCallback } from "react";
import { fetchEvents, fetchTicketTypes } from "../../redux/events/eventActions";
import { clearEventsError } from "../../redux/events/eventSlice";

export default function Events({ navigation }) {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const { user, token } = useSelector((state) => state.auth);
  const [mergedEvents, setMergedEvents] = useState([]);
  const isAuthenticated = !!(user && token);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    dispatch(fetchEvents(abortControllerRef.current.signal));

    return () => {
      dispatch(clearEventsError());
      abortControllerRef.current?.abort();
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchAndMergeData = async () => {
      if (events.length > 0) {
        const controller = new AbortController();
        const signal = controller.signal;
        abortControllerRef.current = controller;

        try {
          const updatedEvents = await Promise.all(
            events.map(async (event) => {
              if (event.id) {
                const ticketTypesForEvent = await dispatch(
                  fetchTicketTypes(event.id, signal)
                );
                return {
                  ...event,
                  ticketTypes: ticketTypesForEvent.payload || [],
                };
              }
              return { ...event, ticketTypes: [] };
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

    if (events.length) fetchAndMergeData();
  }, [events, dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchEvents());
    dispatch(clearEventsError());
  }, [dispatch]);

  const handleNavigateToCheckout = useCallback(
    (event) => {
      navigation.navigate("CheckoutNavigator", {
        screen: "Checkout",
        params: { event },
      });
    },
    [navigation]
  );

  const renderHeader = useCallback(
    () => (
      <View>
        <RNText variant={"title"} style={styles.headerText}>
          Upcoming Events
        </RNText>
      </View>
    ),
    []
  );

  const renderFooter = useCallback(
    () => (
      <View>
        <RNText variant={"title"} style={styles.headerText}>
          Past Events
        </RNText>
      </View>
    ),
    []
  );

  const renderItem = useCallback(
    ({ item }) => {
      if (item.type === "header") return renderHeader();
      if (item.type === "footer") return renderFooter();

      return (
        <View key={item.id}>
          <EventCard
            event={item}
            ticketTypes={item.ticketTypes}
            isAuthenticated={isAuthenticated}
            handleNavigate={handleNavigateToCheckout}
          />
        </View>
      );
    },
    [isAuthenticated, handleNavigateToCheckout, renderHeader, renderFooter]
  );

  const data = [
    { type: "header", key: "upcoming-header" },
    ...(mergedEvents && mergedEvents.filter((item) => !item.expired).reverse()), // Reverse upcoming events
    { type: "footer", key: "past-footer" },
    ...(mergedEvents && mergedEvents.filter((item) => item.expired).reverse()), // Reverse past events
  ];

  return (
    <SafeAreaView style={styles.container}>
      {loading && !mergedEvents.length ? (
        <View style={styles.centered}>
          <ActivityIndicator animating={true} />
        </View>
      ) : (
        <FlatList
          data={data || []}
          renderItem={renderItem}
          keyExtractor={(item) => (item.id ? item.id.toString() : item.key)}
          numColumns={1}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
          }
        />
      )}
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  contentContainer: {
    paddingVertical: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
