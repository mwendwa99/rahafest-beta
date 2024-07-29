import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  View,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import MasonryList from "react-native-masonry-list";
import { useDispatch, useSelector } from "react-redux";
import { fetchGallery } from "../../../redux/news/newsActions";
import { ActivityIndicator } from "react-native-paper";
import { rahaImageApi } from "../../../services/api.service";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Dropdown } from "../../../components";

const placeholderImage = "../../../assets/placeholder.png"; // Placeholder image path
const dropdownTitle = "RahaFest March 2024 Recap";

export default function Media() {
  const dispatch = useDispatch();
  const { gallery, loading } = useSelector((state) => state.news);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAccordion, setShowAccordion] = useState(false);

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  const formattedImages = useMemo(() => {
    if (gallery) {
      return gallery.map((item) => ({
        uri: item.image ? rahaImageApi + item.image : placeholderImage,
        id: item.id.toString(),
      }));
    }
    return [];
  }, [gallery]);

  const onRefresh = useCallback(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  const renderImage = useCallback(
    ({ uri, id }) => (
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
    ),
    []
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView nestedScrollEnabled>
        <Text
          value=" Gallery"
          variant="subtitle"
          style={{
            color: "#fff",
            alignSelf: "center",
            margin: 10,
            padding: 10,
          }}
        />
        <Dropdown
          showAccordion={showAccordion}
          setShowAccordion={setShowAccordion}
          title={dropdownTitle}
        >
          {showAccordion && formattedImages.length > 0 ? (
            <MasonryList
              images={formattedImages.map((img) => ({
                uri: img.uri,
                id: img.id,
                component: renderImage({ uri: img.uri, id: img.id }), // Custom render function
              }))}
              spacing={4}
              columns={2}
              backgroundColor="#212529"
              imageContainerStyle={styles.imageContainer}
              onPressImage={(item, index) => {
                setSelectedImage(item.uri);
                setModalVisible(true);
              }}
              onRefresh={onRefresh}
              refreshing={loading}
            />
          ) : (
            <View style={styles.noImages}>
              <Text
                value="No images available"
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
        </Dropdown>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212529",
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
  noImages: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});
