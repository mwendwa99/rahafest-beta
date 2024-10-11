import * as React from "react";
import { Dimensions, Image, Linking, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel from "react-native-reanimated-carousel";

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
};

function AdCarousel({ data }) {
  const handlePress = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={styles.carousel.width}
        height={100} // Match the ads container height
        autoPlay={true}
        data={data}
        style={styles.carousel}
        scrollAnimationDuration={1000}
        // onSnapToItem={(index) => console.log("current indxex:", index)}
        renderItem={({ item }) => {
          if (!item.is_active) return null; // Early return for inactive items

          return (
            <View style={styles.itemContainer}>
              <TouchableOpacity onPress={() => handlePress(item.url)}>
                <Image source={item.image} style={{ resizeMode: "cover" }} />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

export default AdCarousel;
