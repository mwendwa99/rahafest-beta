import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  Text as RNText,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";

import React, { useEffect, useState, useCallback, memo } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { FontAwesome5 } from "@expo/vector-icons";

const NewsCard = memo(({ newsItem }) => {
  const handleReadMore = useCallback(() => {
    if (newsItem.youtube_url) {
      Linking.openURL(newsItem.youtube_url);
    }
  }, [newsItem.youtube_url]);

  return (
    <View style={styles.newsCard}>
      {newsItem.image && (
        <Image source={{ uri: newsItem.image }} style={styles.newsImage} />
      )}
      <View style={styles.newsContent}>
        <RNText style={styles.newsTitle}>{newsItem.title}</RNText>
        <RNText
          style={styles.newsDescription}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {newsItem.description}
        </RNText>
        {newsItem.youtube_url && (
          <TouchableOpacity
            style={styles.readMoreButton}
            onPress={handleReadMore}
          >
            <RNText style={styles.readMoreText}>
              Read More <FontAwesome5 name="link" size={14} color="#fff" />
            </RNText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

const EmptyListComponent = () => (
  <View style={styles.noNewsContainer}>
    <RNText style={styles.noNewsText}>No news available at the moment.</RNText>
  </View>
);

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://api.rahafest.com/api/media");
      if (response.status === 200 && response.data?.data) {
        setNews(response.data.data);
      } else {
        setError("Failed to load news. Please try again later.");
      }
    } catch (err) {
      console.error("News fetch error:", err);
      setError("Failed to load news. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const onRefresh = useCallback(() => {
    fetchNews();
  }, [fetchNews]);

  const renderItem = useCallback(
    ({ item }) => <NewsCard newsItem={item} />,
    []
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 150,
      offset: 150 * index,
      index,
    }),
    []
  );

  if (loading && !news.length) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  if (error && !news.length) {
    return (
      <View style={styles.errorContainer}>
        <RNText style={styles.errorText}>News will be available soon!</RNText>
        <StatusBar style="dark" />
      </View>
    );
  }

  const listData = [...news].reverse();

  return (
    <SafeAreaView style={styles.container}>
      <RNText style={styles.title}>Latest News</RNText>
      <FlatList
        style={styles.list}
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
        ListEmptyComponent={EmptyListComponent}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        getItemLayout={getItemLayout}
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212529",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  newsCard: {
    backgroundColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
  },
  newsImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  newsContent: {
    padding: 15,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 16,
    color: "#ddd",
    lineHeight: 22,
    marginBottom: 10,
  },
  readMoreButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  readMoreText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  noNewsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noNewsText: {
    color: "grey",
    fontSize: 16,
    textAlign: "center",
  },
});

export default News;
