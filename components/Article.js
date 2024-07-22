import React from "react";
import {
  View,
  Text,
  Image,
  Touchable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { rahaImageApi } from "../services/api.service";

const Article = ({ news }) => {
  const handleReadMore = () => {
    console.log("Read more clicked");
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={{
            uri: rahaImageApi + news.image,
          }}
          style={styles.image}
        />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{news.title}</Text>
        <Text style={styles.description}>
          {`${news.description.split(" ").slice(0, 20).join(" ")}...`}
        </Text>
        <TouchableOpacity onPress={handleReadMore}>
          <Text style={styles.readMore}>Read more</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 12,
    margin: 5,
    width: 350,
    backgroundColor: "#fff",
    color: "#fafafa",
    borderRadius: 6,
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 120,
    borderRadius: 4,
    objectFit: "cover",
  },
  detailsContainer: {
    flex: 2,
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 12,
    color: "#666",
  },
  readMore: {
    fontSize: 12,
    marginTop: 12,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default Article;
