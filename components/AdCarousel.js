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
    height: 200,
  },
  carousel: {
    width: width * 0.9,
    alignSelf: "center",
  },
  itemContainer: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
};

function AdCarousel({ data, variant }) {
  const handlePress = React.useCallback((url) => {
    if (url && url !== "") {
      Linking.openURL(url);
    }
  }, []);

  // Process the data based on variant
  const processedData = React.useMemo(() => {
    // First filter active ads
    const activeAds = data.filter((item) => item.is_active);

    if (variant) {
      // If variant is specified, create separate carousel items for each matching variant image
      const variantAds = activeAds.reduce((acc, ad) => {
        // Find all images that match the variant
        const matchingImages =
          ad.ad_images?.filter((img) => img.image_name === variant) || [];

        // Create a carousel item for each matching image
        const carouselItems = matchingImages.map((img) => ({
          ...ad,
          displayImage: img.image,
        }));

        return [...acc, ...carouselItems];
      }, []);

      return variantAds.length > 1
        ? [...variantAds, ...variantAds]
        : variantAds;
    } else {
      // If no variant specified, show all active ads with their default images
      const defaultAds = activeAds.map((ad) => ({
        ...ad,
        displayImage: ad.image,
      }));

      return defaultAds.length > 1
        ? [...defaultAds, ...defaultAds]
        : defaultAds;
    }
  }, [data, variant]);

  // Render nothing if no matching ads
  if (!processedData.length) return null;

  return (
    <View style={styles.container}>
      <Carousel
        loop={true}
        width={styles.carousel.width}
        height={200}
        autoPlay={true}
        data={processedData}
        enabled={false}
        style={styles.carousel}
        scrollAnimationDuration={2000}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity
              disabled={!item.url}
              onPress={() => handlePress(item.url)}
            >
              <Image source={{ uri: item.displayImage }} style={styles.image} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

export default React.memo(AdCarousel);
