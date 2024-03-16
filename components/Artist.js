import { View, Image, StyleSheet } from "react-native";
import Text from "./Text";
import { prod } from "../env";

export default function Artist({ artist, feature }) {
  return (
    <View style={styles.artist}>
      <Image
        style={[
          styles.image,
          {
            borderColor:
              artist.band_name === "Davido" ||
              artist.band_name === "King Promise"
                ? "red"
                : "#212529",
            borderWidth: 2,
            height:
              artist.band_name === "Davido" ||
              artist.band_name === "King Promise"
                ? 150
                : 100,
            width:
              artist.band_name === "Davido" ||
              artist.band_name === "King Promise"
                ? 150
                : 100,
            borderRadius:
              artist.band_name === "Davido" ||
              artist.band_name === "King Promise"
                ? 10
                : 10,
          },
        ]}
        source={{
          uri: `${prod.image}${artist.band_image}`,
        }}
      />
      <Text variant={"description"} value={artist.band_name} />
    </View>
  );
}

const styles = StyleSheet.create({
  artist: {
    display: "flex",
    flexDirection: "columns",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    marginRight: 10,
    objectFit: "cover",
  },
  time: {
    color: "#fff",
    fontSize: 14,
  },
});
