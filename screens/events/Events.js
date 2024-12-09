import {
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  Text as RNText,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { EventCard, Text } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchEvents, fetchTicketTypes } from "../../redux/events/eventActions";
import { clearEventsError } from "../../redux/events/eventSlice";
import EventList from "../../components/EventList";
import { formatEventDates } from "../../utils/helper";

export default function Events({ navigation }) {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const { user, token } = useSelector((state) => state.auth);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedEvents, setProcessedEvents] = useState([]);

  const calculateTicketPricing = (ticket) => {
    const discountRate = ticket.discount_rate || 0;
    const currentPrice = parseFloat(ticket.price);
    const originalPrice = currentPrice / (1 - discountRate / 100);

    return {
      ...ticket,
      originalPrice: originalPrice.toFixed(2),
      currentPrice: currentPrice.toFixed(2),
      discount: (originalPrice - currentPrice).toFixed(2),
      discountPercentage: discountRate,
    };
  };

  const processEvents = useCallback(async () => {
    if (!events?.length) return;

    try {
      const ticketResults = [];
      for (const event of events) {
        try {
          const action = await dispatch(fetchTicketTypes(event.id));
          const tickets = action.payload || action.data || [];
          ticketResults.push({
            eventId: event.id,
            tickets: tickets && tickets.map(calculateTicketPricing),
          });
        } catch (error) {
          console.error(`Error fetching tickets for event ${event.id}:`, error);
        }
      }

      const ticketMap = ticketResults.reduce((acc, { eventId, tickets }) => {
        acc[eventId] = tickets;
        return acc;
      }, {});

      setProcessedEvents(
        events
          .map((event) => ({
            ...event,
            tickets: ticketMap[event.id] || [],
          }))
          .filter(
            (event) => event.tickets.some((ticket) => !ticket.is_rahaclub_vip) //non vip tickets
          )
      );
    } catch (error) {
      console.error("Error in processEvents:", error);
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  }, [dispatch, events]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    if (!isProcessing) processEvents();
  }, [events, processEvents, isProcessing]);

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
        params: { data },
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
              tickets={item?.tickets}
              onPress={handleNavigateToCheckout}
            />
          </View>
        );
    }
  };

  const data = useMemo(
    () => [
      { type: "header", key: "upcoming-header" },
      ...(processedEvents.filter((item) => !item.expired).reverse() || []),
      { type: "footer", key: "past-footer" },
      ...(processedEvents.filter((item) => item.expired).reverse() || []),
    ],
    [processedEvents]
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading && !processedEvents.length ? (
        <View style={styles.centered}>
          <ActivityIndicator color={"pink"} size={50} />
        </View>
      ) : (
        <FlatList
          data={data}
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
