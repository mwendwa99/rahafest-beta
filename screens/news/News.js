import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from "react-native";

import { Article, Text } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { fetchNews } from "../../redux/news/newsActions";
import React, { useEffect, useState } from "react";
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
      <Text
        value="Here is what you missed in March"
        variant="subtitle"
        style={{ color: "#fff" }}
      />
      {/* <TouchableOpacity
        style={styles.accordionInner}
        onPress={() => setShowAccordion(!showAccordion)}
        disabled
      >
        <Text
          value="Here is what you missed in March"
          variant="subtitle"
          style={{ color: "#fff" }}
        />

        <Text
          value="Here is what you missed in March"
          variant="subtitle"
          style={{ color: "#fff" }}
        />
        <MaterialCommunityIcons
          name={showAccordion ? "chevron-up" : "chevron-down"}
          size={24}
          color="white"
        />
      </TouchableOpacity> */}
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
