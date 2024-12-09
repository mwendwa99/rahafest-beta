import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import {
  fetchEvents,
  fetchTicketTypes,
} from "../../../redux/events/eventActions";
import EventList from "../../../components/EventList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { formatEventDates } from "../../../utils/helper";

export default function Deals() {
  const { events } = useSelector((state) => state.events);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedEvents, setProcessedEvents] = useState([]);
  const dispatch = useDispatch();

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

  const processEvents = async () => {
    if (!events?.length) {
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    try {
      const ticketResults = [];
      for (const event of events) {
        try {
          const action = await dispatch(fetchTicketTypes(event.id));
          const tickets = action.payload || action.data || [];
          ticketResults.push({
            eventId: event.id,
            tickets: tickets.map(calculateTicketPricing),
          });
        } catch (error) {
          console.error(`Error fetching tickets for event ${event.id}:`, error);
          ticketResults.push({ eventId: event.id, tickets: [] });
        }
      }

      const ticketMap = ticketResults.reduce((acc, { eventId, tickets }) => {
        acc[eventId] = tickets;
        return acc;
      }, {});

      const processed = events
        .map((event) => ({
          ...event,
          tickets: ticketMap[event.id] || [],
        }))
        .filter((event) =>
          event.tickets.some((ticket) => ticket.is_rahaclub_vip)
        );

      setProcessedEvents(processed);
    } catch (error) {
      console.error("Error in processEvents:", error);
      setProcessedEvents([]);
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  // Initial fetch of events
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      await dispatch(fetchEvents());
    };
    fetchInitialData();
  }, [dispatch]);

  // Process events whenever they change
  useEffect(() => {
    processEvents();
  }, [events]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await dispatch(fetchEvents());
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>
        {isLoading ? "Loading deals..." : "Processing deals..."}
      </Text>
    </View>
  );

  const renderEmptyList = () => {
    if (isLoading || isProcessing) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyList}>
          Stay tuned for exclusive VIP deals!
        </Text>
      </View>
    );
  };

  if (isLoading || isProcessing) {
    return renderLoading();
  }

  // console.log(JSON.stringify(processedEvents));

  return (
    <View style={styles.container}>
      <FlatList
        data={processedEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventList
            id={item?.id}
            title={item?.title}
            subtitle={item?.organization.organization_name}
            image={item?.banner}
            date={formatEventDates(item?.start_date, item?.end_date)}
            location={item?.location}
            onPress={() => console.log(item?.id)}
            expired={item?.expired}
            tickets={item?.tickets}
          />
        )}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});
