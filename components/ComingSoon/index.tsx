import React from "react";
import { View, Image, StyleSheet } from "react-native";

import comingSoon from "@/assets/images/coming-soon.jpg";

export default function ComingSoon() {
  return (
    <View style={styles.container}>
      <Image source={comingSoon} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    height: 200,
    width: 200,
    resizeMode: "contain",
  },
});
