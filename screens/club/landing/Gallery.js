import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Modal,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import MasonryList from "react-native-masonry-list";
import { useDispatch, useSelector } from "react-redux";
import { fetchGallery } from "../../../redux/news/newsActions";
import { ActivityIndicator } from "react-native-paper";
import { rahaImageApi } from "../../../services/api.service";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "../../../components";

export default function Media() {
  const dispatch = useDispatch();
  const { gallery, loading } = useSelector((state) => state.news);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [showAccordion, setShowAccordion] = useState(false);

  // console.log(gallery);

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
      <Text
        value=" Gallery"
        variant="subtitle"
        style={{ color: "#fff", alignSelf: "center", margin: 10, padding: 10 }}
      />
      {/* <ImageBackground
        style={styles.accordionOuter}
        source={require("../../../assets/pattern-single.png")}
      >
        <TouchableOpacity
          style={styles.accordionInner}
          onPress={() => setShowAccordion(!showAccordion)}
        >
          <Text
            value="What to expect at the upcoming Raha Rave 2024"
            variant="subtitle"
            style={{ color: "#fff" }}
          />
          <MaterialCommunityIcons
            name={showAccordion ? "chevron-up" : "chevron-down"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </ImageBackground> */}
      <ImageBackground
        style={styles.accordionOuter}
        source={require("../../../assets/pattern-single.png")}
      >
        <TouchableOpacity
          style={styles.accordionInner}
          onPress={() => setShowAccordion(!showAccordion)}
        >
          <Text
            value=" RahaFest March 2024 Recap"
            variant="subtitle"
            style={{ color: "#fff" }}
          />
          <MaterialCommunityIcons
            name={showAccordion ? "chevron-up" : "chevron-down"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </ImageBackground>
      {showAccordion && (
        <View style={{ flex: 1 }}>
          <MasonryList
            images={images.map((img) => ({
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
        </View>
      )}
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
