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

// Dummy data array with event categories
const eventCategories = [
  { title: "Raha Rave 2024", key: "rave2024" },
  { title: "Raha December", key: "december" },
  { title: "RahaFest", key: "rahafest" },
];

export default function Media() {
  const dispatch = useDispatch();
  const { gallery, loading } = useSelector((state) => state.news);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [accordionState, setAccordionState] = useState({});

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  const formattedGallery = useMemo(() => {
    const categorizedGallery = {
      rave2024: [],
      december: [],
      rahafest: gallery
        ? gallery.map((item) => ({
            uri: item.image ? rahaImageApi + item.image : placeholderImage,
            id: item.id.toString(),
          }))
        : [],
    };
    return categorizedGallery;
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

  const toggleAccordion = (key) => {
    setAccordionState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

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
          value="Gallery"
          variant="subtitle"
          style={{
            color: "#fff",
            alignSelf: "center",
            margin: 10,
            padding: 10,
          }}
        />
        {eventCategories.map((event) => (
          <Dropdown
            key={event.key}
            showAccordion={accordionState[event.key]}
            setShowAccordion={() => toggleAccordion(event.key)}
            title={event.title}
          >
            {accordionState[event.key] &&
            formattedGallery[event.key].length > 0 ? (
              <MasonryList
                images={formattedGallery[event.key].map((img) => ({
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
                  value="Coming soon"
                  variant="body"
                  style={{ color: "#fff" }}
                />
              </View>
            )}
          </Dropdown>
        ))}
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
