import React from "react";
import { View, Text, Image, Touchable, StyleSheet } from "react-native";

const Article = ({ news }) => {
  return (
    <View style={styles.container}>
      {/* Article Banner */}
      <View>
        <Image source={news.image} style={styles.banner} />
      </View>

      {/* Article Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{news.title}</Text>
        <Text style={styles.description}>{news.description}</Text>
        <Text style={styles.readMore}>Read more</Text>
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
  banner: {
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
  }
});

export default Article;
