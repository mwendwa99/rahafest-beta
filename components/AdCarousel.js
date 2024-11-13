import * as React from "react";
import { Dimensions, Image, Linking, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel from "react-native-reanimated-carousel";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const { width } = Dimensions.get("window");

const styles = {
  container: {
    width,
    height: 100,
  },
  carousel: {
    width: width * 0.9, // 90% of the screen width
    alignSelf: "center", // Center the carousel
  },
  itemContainer: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: "100%", // Full width of the carousel item
    height: 200, // Set height for the image
    resizeMode: "contain", // Ensure the image covers the area
  },
};

function AdCarousel({ data }) {
  const handlePress = (url) => {
    if (url && url !== "") {
      Linking.openURL(url);
    }
  };

  // console.log(data);

  const hasMultipleAds = (items) => {
    const activeAds = items.filter((item) => item.is_active);
    return activeAds.length > 1;
  };

  return (
    <View style={styles.container}>
      <Carousel
        loop={hasMultipleAds(data)}
        width={styles.carousel.width}
        height={100} // Match the ads container height
        autoPlay={true}
        data={data}
        enabled={false}
        style={styles.carousel}
        scrollAnimationDuration={1500}
        renderItem={({ item }) => {
          if (!item.is_active) return null; // Early return for inactive items

          return (
            <View style={styles.itemContainer}>
              <TouchableOpacity
                disabled={!item.url} // Disable if url is undefined, null, or empty
                onPress={() => handlePress(item.url)}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.image} // Add the defined style here
                />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

export default AdCarousel;
