import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import { Accordion } from "../../components";
import { StatusBar } from "expo-status-bar";
import axios from "axios";

const splash = require("../../assets/splash.png");

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://api.rahafest.com/api/faqs");
      if (response.status === 200 && response.data?.data) {
        setFaqs(response.data.data);
      } else {
        setError("Failed to load FAQs. Please try again later.");
      }
    } catch (err) {
      console.error("Faqs fetch error:", err);
      setError("Failed to load FAQs. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  if (loading) {
    return (
      <ImageBackground
        source={splash}
        style={{ flex: 1, justifyContent: "center" }}
      >
        <ActivityIndicator size="large" color="orange" />
        <StatusBar style="light" />
      </ImageBackground>
    );
  }

  if (error) {
    console.error(error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>FAQs will be available soon!</Text>
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={faqs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <Accordion
            question={item.question}
            answer={item.answer} // Directly use answer, assuming basic HTML or text
            index={index}
          />
        )}
        ListEmptyComponent={() =>
          !loading &&
          !error && (
            <View style={styles.noFaqsContainer}>
              <Text style={styles.noFaqsText}>
                No FAQs available at the moment.
              </Text>
            </View>
          )
        }
      />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#212529",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "black", // Or any color you prefer for error text
    fontSize: 18,
    textAlign: "center",
  },
  noFaqsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noFaqsText: {
    color: "grey", // Or any color you prefer for no FAQ text
    fontSize: 16,
    textAlign: "center",
  },
});
