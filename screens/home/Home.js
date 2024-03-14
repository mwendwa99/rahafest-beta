import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { FontAwesome5, Entypo, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Portal, Modal } from "react-native-paper";

import { Text, CText } from "../../components";

const image = require("../../assets/background.webp");
const logo = require("../../assets/logo.png");
const blob = require("../../assets/blob.png");

export default function Home({ navigation }) {
  const [visible, setVisible] = useState(false);

  const toggleModal = () => setVisible(!visible);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => navigation.navigate("Playlist")}>
              <ImageBackground source={blob} style={styles.blob}>
                <FontAwesome5 name="headphones-alt" size={40} color="#fff" />
                <Text variant="small" value={"Playlist"} color="#fff" />
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal}>
              <ImageBackground source={blob} style={styles.blob}>
                <Entypo name="mobile" size={40} color="#fff" />
                <Text variant="small" value={"Socials"} color="#fff" />
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity>
              <ImageBackground source={blob} style={styles.blob}>
                <Ionicons name="people-sharp" size={40} color="#fff" />
                <Text variant="small" value={"Partners"} color="#fff" />
              </ImageBackground>
            </TouchableOpacity>
          </View>
          <View style={styles.column}>
            <Text variant="title" value={"Venue"} color="#fff" />
            <CText
              variant="title"
              value={"Uhuru Gardens, Nairobi, Kenya"}
              color="#fff"
              textStyle={{ fontSize: 24, lineHeight: 32 }}
            />
          </View>
          <View style={styles.column}>
            <Text variant="title" value={"Dates"} color="#fff" />
            <CText
              variant="title"
              value={"Sat 30th & 31st March 2024"}
              color="#fff"
              textStyle={{ fontSize: 24, lineHeight: 32 }}
            />
          </View>
        </View>
      </ImageBackground>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={toggleModal}
          contentContainerStyle={styles.modalStyle}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <FontAwesome5
              name="tiktok"
              size={38}
              color="#fff"
              style={{ marginHorizontal: 10 }}
              onPress={() =>
                Linking.openURL("https://www.tiktok.com/@rahafest/")
              }
            />
            <Entypo
              name="twitter"
              size={40}
              color="#4267B2"
              style={{ marginHorizontal: 10 }}
              onPress={() => Linking.openURL("https://twitter.com/raha_fest")}
            />
            <Entypo
              name="instagram"
              size={40}
              color="#C13584"
              style={{ marginHorizontal: 10 }}
              onPress={() =>
                Linking.openURL("https://www.instagram.com/rahafest/")
              }
            />
            <Entypo
              name="youtube"
              size={40}
              color="#FF0000"
              style={{ marginHorizontal: 10 }}
              onPress={() =>
                Linking.openURL("https://www.youtube.com/@rahafest")
              }
            />
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
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
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    objectFit: "contain",
  },
  section: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  blob: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  modalStyle: {
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
