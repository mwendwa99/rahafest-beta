import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Pressable,
  StatusBar,
} from "react-native";
import {
  FontAwesome5,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { Portal, Modal } from "react-native-paper";

import { Text, Avatar } from "../../components";

const background = {
  uri: "https://api.rahafest.com/media_files/banners/background.png",
};
const logo = require("../../assets/logo.png");
const blob = require("../../assets/blob.png");

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.background}
      ></ImageBackground>
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  background: {
    flex: 1,
  },
});
