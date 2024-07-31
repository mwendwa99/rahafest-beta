import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  View,
  Image,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { fetchGallery } from "../../../redux/news/newsActions";
import { ActivityIndicator } from "react-native-paper";
import { rahaImageApi } from "../../../services/api.service";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Dropdown } from "../../../components";

const placeholderImage = "../../../assets/placeholder.png"; // Placeholder image path

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
    const categorizedGallery = gallery.reduce((acc, item) => {
      if (item.event_name) {
        if (!acc[item.event_name]) {
          acc[item.event_name] = [];
        }
        acc[item.event_name].push({
          uri: item.image ? rahaImageApi + item.image : placeholderImage,
          id: item.id.toString(),
        });
      }
      return acc;
    }, {});
    return categorizedGallery;
  }, [gallery]);

  const onRefresh = useCallback(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  const handleImagePress = (uri) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const renderImage = useCallback(
    ({ uri, id }) => (
      <TouchableOpacity onPress={() => handleImagePress(uri)} key={id}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri }}
            style={styles.image}
            resizeMode="cover"
            onError={(e) => {
              console.error("Image failed to load", e.nativeEvent.error);
            }}
          />
        </View>
      </TouchableOpacity>
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

  const renderCategory = ({ item }) => (
    <View>
      <Dropdown
        key={item}
        showAccordion={accordionState[item]}
        setShowAccordion={() => toggleAccordion(item)}
        title={item}
      >
        {accordionState[item] && formattedGallery[item].length > 0 ? (
          <FlatList
            data={formattedGallery[item]}
            keyExtractor={(img) => img.id}
            renderItem={({ item }) => renderImage(item)}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={Object.keys(formattedGallery).reverse()} // Use the keys from the formatted gallery
        keyExtractor={(item) => item.toString()} // Use the event name as the key
        renderItem={renderCategory}
        onRefresh={onRefresh}
        refreshing={loading}
      />
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
  imageContainer: {
    borderRadius: 6,
    overflow: "hidden",
    margin: 4,
  },
  image: {
    width: 150, // Adjust width as needed
    height: 150, // Adjust height as needed
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
  columnWrapper: {
    // padding: 10,
    // margin: 10,
    justifyContent: "space-evenly",
  },
});
