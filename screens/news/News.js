import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  Text as RNText,
} from "react-native";

import { Article, Text } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { fetchNews } from "../../redux/news/newsActions";
import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function News() {
  const { news, loading, error } = useSelector((state) => state.news);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  if (error) {
    console.log(error);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <RNText>News will be available soon!</RNText>
        <StatusBar style="dark" />
      </View>
    );
  }

  const onRefresh = () => {
    dispatch(fetchNews());
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text
        value="Here is what you missed in March"
        variant="subtitle"
        style={{ color: "#fff" }}
      />
      <FlatList
        style={styles.eventCardContainer}
        data={news}
        renderItem={({ item }) => <Article news={item} />}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: "100%",
    alignItems: "center",
    backgroundColor: "#212529",
  },
  accordionOuter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 10,
    objectFit: "cover",
    backgroundRepeat: "repeat",
  },
  accordionInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 1)",
    padding: 20,
    borderRadius: 10,
    width: "100%",
  },
  eventCardContainer: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
