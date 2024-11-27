import React from "react";
import { StyleSheet, View } from "react-native";

import ImageBackground from "@/components/ImageBackground";
import IconButton from "@/components/IconButton";
import Container from "@/components/Container";

import backgroundImage from "@/assets/images/background.png";
import gallery from "@/assets/images/gallery-btn.png";
import social from "@/assets/images/social-btn.png";
import more from "@/assets/images/more-btn.png";

export default function Index() {
  return (
    <Container>
      <ImageBackground uri={backgroundImage}>
        <View style={styles.linksContainer}>
          <IconButton source={gallery} size={100} title="Gallery" />
          <IconButton source={social} size={100} title="Socials" />
          <IconButton source={more} size={100} title="Extras" />
        </View>
      </ImageBackground>
    </Container>
  );
}

const styles = StyleSheet.create({
  linksContainer: {
    position: "absolute",
    bottom: 150,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
