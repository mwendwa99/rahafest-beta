import { StyleSheet, FlatList, RefreshControl, View, Text } from "react-native";
import { EventCard } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchEvents, fetchTicketTypes } from "../../redux/events/eventActions";
import { ActivityIndicator } from "react-native-paper";

export default function Events() {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const { user, token } = useSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [mergedEvents, setMergedEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchEvents());
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (user && token) {
      setIsAuthenticated(true);
    }
  }, [user, token]);

  useEffect(() => {
    const fetchAndMergeData = async () => {
      if (events.length > 0) {
        const updatedEvents = await Promise.all(
          events.map(async (event) => {
            const ticketTypesForEvent = await dispatch(
              fetchTicketTypes(event.id)
            );
            return {
              ...event,
              ticketTypes: ticketTypesForEvent.payload || [],
            };
          })
        );
        setMergedEvents(updatedEvents);
      }
    };

    fetchAndMergeData();
  }, [events, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchEvents());
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator animating={true} />
      </View>
    );
  }

  if (error) {
    console.log(error);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Oops! Something went wrong with the server.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={mergedEvents}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            ticketTypes={item.ticketTypes}
            isAuthenticated={isAuthenticated}
          />
        )}
        keyExtractor={(item) => item.id}
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
    padding: 0,
    margin: 0,
    flexGrow: 1, // Ensure FlatList takes up available space
  },
});
