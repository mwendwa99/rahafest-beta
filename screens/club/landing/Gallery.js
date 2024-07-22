import React, { useEffect, useState } from "react";
import { StyleSheet, View, RefreshControl, Image, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import MasonryList from "react-native-masonry-list";
import { useDispatch, useSelector } from "react-redux";
import { fetchGallery } from "../../../redux/news/newsActions";
import { ActivityIndicator } from "react-native-paper";
import { rahaImageApi } from "../../../services/api.service";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Media() {
  const dispatch = useDispatch();
  const { gallery, loading } = useSelector((state) => state.news);
  const [images, setImages] = useState([]);

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  useEffect(() => {
    if (gallery) {
      const formattedImages = gallery.map((item) => {
        const uri = rahaImageApi + item.image;
        return {
          uri,
          id: item.id.toString(),
        };
      });
      setImages(formattedImages);
    }
  }, [gallery]);

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

  const renderImage = ({ uri, id }) => (
    <View style={styles.imageContainer} key={id}>
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode="cover"
        onError={(e) => {
          console.error("Image failed to load", e.nativeEvent.error);
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <MasonryList
        images={images.map((img) => ({
          uri: img.uri,
          id: img.id,
          component: renderImage({ uri: img.uri, id: img.id }), // Custom render function
        }))}
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
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    borderRadius: 6,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200, // Adjust height as needed
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
