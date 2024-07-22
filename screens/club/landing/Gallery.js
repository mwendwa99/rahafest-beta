import React, { useEffect } from "react";
import { StyleSheet, View, RefreshControl, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import MasonryList from "react-native-masonry-list";
import { useDispatch, useSelector } from "react-redux";
import { fetchGallery } from "../../../redux/news/newsActions";
import { ActivityIndicator } from "react-native-paper";
import { rahaImageApi } from "../../../services/api.service"; // Ensure this import is correct

export default function Media() {
  const dispatch = useDispatch();
  const { gallery, loading } = useSelector((state) => state.news);

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchGallery());
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  const images =
    gallery &&
    gallery.map((item) => {
      const uri = rahaImageApi + item.image;
      console.log("Image URL:", uri);
      return {
        uri,
        id: item.id.toString(),
      };
    });

  return (
    <View style={styles.container}>
      <MasonryList
        images={images}
        spacing={4}
        columns={2}
        backgroundColor="#fff"
        imageContainerStyle={styles.imageContainer}
        onEndReached={() => {
          // Implement pagination logic if needed
        }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    borderRadius: 6,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
