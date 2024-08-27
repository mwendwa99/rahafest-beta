import {
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  Text as RNText,
  ScrollView,
} from "react-native";
import { EventCard, Text } from "../../components";
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

  const abortControllerRef = useRef(null);

  useEffect(() => {
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
                const ticketTypesForEvent = await dispatch(
                  fetchTicketTypes(event.id, signal)
                );
                return {
                  ...event,
                  ticketTypes: ticketTypesForEvent.payload || [],
                };
              }
              return {
                ...event,
                ticketTypes: [],
              };
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
    dispatch(clearEventsError());
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
      <ScrollView
        contentContainerStyle={styles.centered}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        <RNText>Events will be available soon!</RNText>
        <StatusBar style="light" />
      </ScrollView>
    );
  }

  const handleNavigateToCheckout = (event) => {
    navigation.navigate("CheckoutNavigator", {
      screen: "Checkout",
      params: { event },
    });
  };

  const renderHeader = () => (
    <View>
      <RNText variant={"title"} style={styles.headerText}>
        Upcoming Events
      </RNText>
    </View>
  );

  const renderFooter = () => (
    <View>
      <RNText variant={"title"} style={styles.headerText}>
        Past Events
      </RNText>
    </View>
  );

  const data = [
    { type: "header", key: "upcoming-header" },
    ...mergedEvents.filter((item) => !item.expired),
    { type: "footer", key: "past-footer" },
    ...mergedEvents.filter((item) => item.expired),
  ];

  const renderItem = ({ item }) => {
    if (item.type === "header") {
      return renderHeader();
    } else if (item.type === "footer") {
      return renderFooter();
    }
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => (item.id ? item.id.toString() : item.key)}
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
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#fafafa",
    textAlign: "center",
    textTransform: "capitalize",
    fontSize: 24,
    fontWeight: "bold",
  },
});
