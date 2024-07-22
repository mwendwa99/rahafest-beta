import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Article } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { fetchNews } from "../../redux/news/newsActions";
import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

export default function News() {
  const { news, loading } = useSelector((state) => state.news);
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

  const onRefresh = () => {
    dispatch(fetchNews());
  };

  return (
    <SafeAreaView style={styles.container}>
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
    width: "100%",
    alignItems: "center",
    backgroundColor: "#212529",
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
