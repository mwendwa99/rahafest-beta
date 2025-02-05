import {
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  Text as RNText,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchEvents } from "../../redux/events/eventActions";
import { clearEventsError } from "../../redux/events/eventSlice";
import EventList from "../../components/EventList";
import { formatEventDates } from "../../utils/helper";

export default function Events({ navigation }) {
  const dispatch = useDispatch();
  const {
    events = [],
    loading,
    error,
  } = useSelector((state) => state.events ?? {});

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      dispatch(fetchEvents());
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      dispatch(clearEventsError());
      await dispatch(fetchEvents());
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNavigateToCheckout = useCallback(
    (event) => {
      navigation.navigate("CheckoutNavigator", {
        screen: "Checkout",
        params: { event, showDiscount: false },
      });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }) => {
      switch (item?.type) {
        case "header":
          const isExpired = Boolean(item?.expired || !item?.is_active);
          return (
            !isExpired && (
              <View>
                <RNText variant="title" style={styles.headerText}>
                  Upcoming Events
                </RNText>
              </View>
            )
          );
        case "footer":
          return (
            <View>
              <RNText variant="title" style={styles.headerText}>
                Past Events
              </RNText>
            </View>
          );
        default: {
          const isExpired = Boolean(item?.expired || !item?.is_active);
          return (
            <View key={item?.id}>
              <EventList
                id={item?.id?.toString() ?? "--"}
                title={item?.title || "--"}
                subtitle={item?.event_organizer || "--"}
                image={item?.banner || ""}
                date={
                  formatEventDates(item?.start_date, item?.end_date) || "--"
                }
                location={item?.venue || "--"}
                expired={isExpired}
                tickets={
                  Array.isArray(item?.ticket_types) ? item.ticket_types : []
                }
                onPress={() => handleNavigateToCheckout(item)}
                isActive={Boolean(item?.is_active)}
                hideDiscounted={true}
              />
            </View>
          );
        }
      }
    },
    [handleNavigateToCheckout]
  );

  const data = useMemo(() => {
    const safeEvents = Array.isArray(events) ? events : [];

    // Get current date for comparison
    const now = new Date();

    // Separate events into upcoming and past based on end_date
    const { upcoming, past } = safeEvents.reduce(
      (acc, event) => {
        if (!event) return acc;

        const endDate = event?.end_date ? new Date(event.end_date) : null;
        // If no end_date, treat as past event
        if (!endDate) {
          acc.past.push(event);
          return acc;
        }

        if (endDate > now) {
          acc.upcoming.push(event);
        } else {
          acc.past.push(event);
        }
        return acc;
      },
      { upcoming: [], past: [] }
    );

    return [
      { type: "header", key: "upcoming-header" },
      ...upcoming.reverse(),
      { type: "footer", key: "past-footer" },
      ...past.reverse(),
    ];
  }, [events]);

  const renderEmptyList = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <RNText style={styles.emptyText}>No events available</RNText>
      </View>
    );
  }, [isLoading]);

  const keyExtractor = useCallback(
    (item, index) =>
      item?.id ? item.id.toString() : `${item?.type || "item"}-${index}`,
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && !events?.length ? (
        <View style={styles.centered}>
          <ActivityIndicator color="pink" size={50} />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={1}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
          ListEmptyComponent={renderEmptyList}
        />
      )}
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    paddingHorizontal: 20,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
