import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Image,
  Modal,
  TouchableOpacity,
  FlatList,
  Text as RNText,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Dropdown } from "../../../components";
// import { clearNewsAndGalleryError } from "../../../redux/news/newsSlice";

export default function Media() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [accordionState, setAccordionState] = useState({});
  const [preloadedImages, setPreloadedImages] = useState({});

  // Prefetch all images and update state once

  // Fetch gallery data on mount and clear errors on unmount

  const renderImage = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => handleImagePress(item.uri)}>
        <View style={styles.imageContainer}>
          {item.loaded ? (
            <Image
              source={{ uri: item.uri }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <ActivityIndicator size="small" color="orange" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    ),
    [handleImagePress]
  );

  const toggleAccordion = useCallback((key) => {
    setAccordionState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const renderCategory = useCallback(
    ({ item: category }) => (
      <View key={category}>
        <Dropdown
          showAccordion={accordionState[category]}
          setShowAccordion={() => toggleAccordion(category)}
          title={category}
        >
          {accordionState[category] && preloadedImages[category]?.length > 0 ? (
            <FlatList
              data={preloadedImages[category]}
              keyExtractor={(img) => img.id.toString()}
              renderItem={renderImage}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              initialNumToRender={6}
              maxToRenderPerBatch={8}
              windowSize={5}
              removeClippedSubviews={true}
            />
          ) : (
            <View style={styles.noImages}>
              <Text
                value="Loading..."
                variant="body"
                style={{ color: "#fff" }}
              />
            </View>
          )}
        </Dropdown>
      </View>
    ),
    [accordionState, preloadedImages, renderImage, toggleAccordion]
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <RNText style={styles.errorText}>Images will be available soon</RNText>
        <StatusBar style="dark" />
      </View>
    );
  }

  if (loading && !gallery) {
    // Show loader only when loading and no gallery data is present
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text value="Raha Gallery" variant="title" style={styles.title} />
      {[] && Object.keys(gallery).length > 0 ? (
        <FlatList
          data={Object.keys(gallery).reverse()}
          keyExtractor={(item) => item.toString()}
          renderItem={renderCategory}
          onRefresh={onRefresh}
          refreshing={loading}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews={true}
        />
      ) : (
        <View style={styles.noImages}>
          <Text
            value="No images available at the moment."
            variant="body"
            style={{ color: "#fff" }}
          />
        </View>
      )}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.fullscreenImageContainer}
            onPress={() => setModalVisible(false)}
          >
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullscreenImage}
            />
          </TouchableOpacity>
        </View>
      </Modal>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212529",
    paddingHorizontal: 10,
    width: "100%",
  },
  title: {
    textAlign: "center",
    color: "#fafafa",
    marginVertical: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  imageContainer: {
    borderRadius: 6,
    overflow: "hidden",
    margin: 4,
  },
  image: {
    width: 150,
    height: 150,
  },
  placeholderImage: {
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
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
  noImages: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  fullscreenImageContainer: {
    width: "100%",
    height: "100%",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  columnWrapper: {
    justifyContent: "space-evenly",
  },
});
