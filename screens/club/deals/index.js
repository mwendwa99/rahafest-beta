import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { fetchEvents } from "../../../redux/events/eventActions";
import EventList from "../../../components/EventList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { formatEventDates } from "../../../utils/helper";

export default function Deals({ navigation }) {
  const { events } = useSelector((state) => state.events);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const handleNavigateToCheckout = useCallback(
    (event) => {
      navigation.navigate("CheckoutNavigator", {
        screen: "Checkout",
        params: { event, showDiscount: true }, // Pass only the clicked event's data
      });
    },
    [navigation]
  );

  // Initial fetch of events
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      await dispatch(fetchEvents());
      setIsLoading(false); // Set to false after fetching is complete
    };
    fetchInitialData();
  }, [dispatch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await dispatch(fetchEvents());
    } finally {
      setIsRefreshing(false); // Set to false after refreshing is complete
    }
  };

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  const renderEmptyList = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyList}>
          Stay tuned for exclusive deals exclusive to Raha Club members!
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <SafeAreaView> */}
      {isLoading || isRefreshing ? renderLoading() : null}
      <FlatList
        data={events.filter(
          (item) =>
            item.is_active &&
            item.ticket_types.some(
              (ticket) => ticket.is_rahaclub_vip && ticket.is_active
            )
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
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
            hideDiscounted={false}
          />
        )}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={{
          paddingBottom: 20, // Add extra padding
        }}
      />

      <StatusBar barStyle={"light-content"} />
      {/* </SafeAreaView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyList: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },

  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});
