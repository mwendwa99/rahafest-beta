import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Image,
  Modal,
  TouchableOpacity,
  FlatList,
  Text as RNText,
  ActivityIndicator,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Dropdown } from "../../../components";
import axios from "axios";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const imageWidth = (windowWidth - 40) / 2; // Two columns with padding

export default function Media() {
  const [galleryData, setGalleryData] = useState(null);
  const [groupedGallery, setGroupedGallery] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [accordionState, setAccordionState] = useState({});
  const [videoMuted, setVideoMuted] = useState(true);
  const videoRef = useRef(null);

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://api.rahafest.com/api/gallery");
      if (response.status === 200 && response.data?.data) {
        setGalleryData(response.data.data);
      } else {
        setError("Failed to load gallery. Please try again later.");
      }
    } catch (err) {
      console.error("Gallery fetch error:", err);
      setError("Failed to load gallery. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  useEffect(() => {
    if (galleryData) {
      const grouped = {};
      galleryData.forEach((item) => {
        const category = item.event_name || "General";
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(item);
      });
      setGroupedGallery(grouped);
    }
  }, [galleryData]);

  const handleMediaPress = useCallback((mediaItem) => {
    setSelectedMedia(mediaItem);
    setModalVisible(true);
  }, []);

  const renderMediaItem = useCallback(
    ({ item }) => {
      const isVideo = item.video && !item.image;
      const mediaUri = item.image || item.video;

      return (
        <TouchableOpacity
          key={item.id}
          onPress={() => handleMediaPress(item)}
          style={styles.mediaContainer}
        >
          {isVideo ? (
            <View style={styles.videoPlaceholder}>
              <Ionicons name="play-circle" size={50} color="#fafafa" />
              <Text style={styles.videoLabel}>Video</Text>
            </View>
          ) : (
            <Image
              source={{ uri: mediaUri }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>
      );
    },
    [handleMediaPress]
  );

  const toggleAccordion = useCallback((key) => {
    setAccordionState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const renderCategory = useCallback(
    ({ item: categoryName }) => {
      const mediaItems = groupedGallery[categoryName] || [];
      return (
        <View key={categoryName}>
          <Dropdown
            showAccordion={accordionState[categoryName]}
            setShowAccordion={() => toggleAccordion(categoryName)}
            title={categoryName}
          >
            {accordionState[categoryName] && mediaItems.length > 0 ? (
              <FlatList
                data={mediaItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMediaItem}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                initialNumToRender={6}
                maxToRenderPerBatch={8}
                windowSize={5}
                removeClippedSubviews={true}
                getItemLayout={(data, index) => ({
                  length: imageWidth + 8, // Adjust based on item width + margin
                  offset: (imageWidth + 8) * index,
                  index,
                })}
                shouldItemUpdate={(prev, next) => {
                  return prev.item !== next.item;
                }}
                ListEmptyComponent={() => (
                  <View style={styles.noImages}>
                    <Text
                      value="No media in this category."
                      variant="body"
                      style={{ color: "#fff" }}
                    />
                  </View>
                )}
              />
            ) : (
              <View style={styles.noImages}>
                <Text
                  value={loading ? "Loading..." : "No media in this category."}
                  variant="body"
                  style={{ color: "#fff" }}
                />
              </View>
            )}
          </Dropdown>
        </View>
      );
    },
    [accordionState, groupedGallery, loading, renderMediaItem, toggleAccordion]
  );

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setVideoMuted(true); // Reset mute state when modal closes
    if (videoRef.current) {
      videoRef.current.pauseAsync(); // Pause video when modal closes
    }
  }, []);

  const toggleMute = useCallback(() => {
    setVideoMuted(!videoMuted);
  }, [videoMuted]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <RNText style={styles.errorText}>{error}</RNText>
        <StatusBar style="dark" />
      </View>
    );
  }

  if (loading && !groupedGallery) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  const categoryKeys = Object.keys(groupedGallery).reverse();

  return (
    <SafeAreaView style={styles.container}>
      <Text value="Raha Gallery" variant="title" style={styles.title} />
      {categoryKeys.length > 0 ? (
        <FlatList
          data={categoryKeys}
          keyExtractor={(item) => item.toString()}
          renderItem={renderCategory}
          refreshing={loading}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews={true}
          ListEmptyComponent={() =>
            !loading && (
              <View style={styles.noImages}>
                <Text
                  value="No media available at the moment."
                  variant="body"
                  style={{ color: "#fff" }}
                />
              </View>
            )
          }
        />
      ) : !loading ? (
        <View style={styles.noImages}>
          <Text
            value="No media available at the moment."
            variant="body"
            style={{ color: "#fff" }}
          />
        </View>
      ) : null}

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={handleModalClose}
          />
          <View style={styles.modalContent}>
            {selectedMedia && selectedMedia.video && !selectedMedia.image ? (
              <View>
                <Video
                  ref={videoRef}
                  source={{ uri: selectedMedia.video }}
                  style={styles.fullscreenVideo}
                  resizeMode="contain"
                  isMuted={videoMuted}
                  shouldPlay
                  isLooping
                  onError={(error) => console.error("Video error:", error)}
                />
                <TouchableWithoutFeedback onPress={toggleMute}>
                  <View style={styles.muteButtonContainer}>
                    <Ionicons
                      name={videoMuted ? "volume-mute" : "volume-high"}
                      size={30}
                      color="#fafafa"
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ) : selectedMedia ? (
              <Image
                source={{ uri: selectedMedia.image || selectedMedia.video }}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            ) : null}
          </View>
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
  mediaContainer: {
    borderRadius: 6,
    overflow: "hidden",
    margin: 4,
    width: imageWidth,
    height: imageWidth,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  videoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  videoLabel: {
    color: "#fafafa",
    marginTop: 5,
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
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContent: {
    backgroundColor: "#212529",
    padding: 0,
    borderRadius: 8,
    maxWidth: "90%",
    maxHeight: "90%",
    elevation: 5,
  },
  fullscreenImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1, // or adjust based on content
    resizeMode: "contain",
  },
  fullscreenVideo: {
    width: "100%",
    height: 300, // Fixed height for video, adjust as needed
  },
  muteButtonContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
  },
  columnWrapper: {
    justifyContent: "space-evenly",
  },
});
