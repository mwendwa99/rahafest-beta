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
  const { events, loading, error } = useSelector((state) => state.events);

  // console.log(JSON.stringify(events));

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
        params: { event }, // Pass only the clicked event's data
      });
    },
    [navigation]
  );

  const renderItem = ({ item }) => {
    switch (item.type) {
      case "header":
        return (
          <View>
            <RNText variant={"title"} style={styles.headerText}>
              Upcoming Events
            </RNText>
          </View>
        );
      case "footer":
        return (
          <View>
            <RNText variant={"title"} style={styles.headerText}>
              Past Events
            </RNText>
          </View>
        );
      default:
        return (
          <View key={item.id}>
            <EventList
              id={item?.id}
              title={item?.title}
              subtitle={item?.organization.organization_name}
              image={item?.banner}
              date={formatEventDates(item?.start_date, item?.end_date)}
              location={item?.location}
              expired={item?.expired}
              tickets={item?.ticket_types}
              onPress={() => handleNavigateToCheckout(item)}
              isActive={item?.is_active}
              hideDiscounted={true}
            />
          </View>
        );
    }
  };

  const data = useMemo(
    () => [
      { type: "header", key: "upcoming-header" },
      ...(events
        .filter(
          (event) =>
            !event.expired &&
            event.is_active && // Filter active events
            event.ticket_types.some(
              (ticket) => !ticket.is_rahaclub_vip && ticket.is_active // Ensure ticket is active
            )
        )
        .reverse() || []),
      { type: "footer", key: "past-footer" },
      ...(events
        .filter(
          (event) =>
            event.expired &&
            event.is_active && // Filter active expired events
            event.ticket_types.some(
              (ticket) => !ticket.is_rahaclub_vip && ticket.is_active // Ensure ticket is active
            )
        )
        .reverse() || []),
    ],
    [events]
  );

  const renderEmptyList = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <RNText style={styles.emptyList}>Events coming soon!</RNText>
      </View>
    );
  };

  function getActiveEvents(events) {
    return events.filter(
      (event) =>
        Array.isArray(event.ticket_types) &&
        event.ticket_types.some(
          (ticket) => ticket.is_active === false || ticket.id !== 22
        )
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && !events.length ? (
        <View style={styles.centered}>
          <ActivityIndicator color={"pink"} size={50} />
        </View>
      ) : (
        <FlatList
          data={getActiveEvents(data)}
          // data={data.filter(
          //   (item) =>
          //     item.is_active &&
          //     item.ticket_types.some((ticket) => ticket.is_active)
          // )}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : `${item.type}-${index}`
          }
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
      <StatusBar barStyle={"dark-content"} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
