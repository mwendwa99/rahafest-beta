import {
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Pressable,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  FontAwesome5,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { Portal, Modal } from "react-native-paper";
import { Asset } from "expo-asset";

import { Text, Avatar, AdCarousel } from "../../components";

const background = require("../../assets/background.png");
const logo = require("../../assets/logo.png");
const blob = require("../../assets/blob.png");

const ads = [
  {
    image: require("../../assets/embassy.png"),
    title: "Found in Translation: The Treasure of the Italian Language",
    description:
      "The Embassy of Italy and the Italian Cultural Institute of Nairobi are pleased to invite you to a special event organized to celebrate this important occasion.",
    is_active: true,
    url: "https://forms.gle/ypPWEa5sgXMmSnGi6",
  },
];

export default function Home({ navigation }) {
  const [visible, setVisible] = useState(false);
  const [isBackgroundReady, setIsBackgroundReady] = useState(false);

  const toggleModal = () => setVisible(!visible);

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  // Preload the background image
  useEffect(() => {
    const preloadImages = async () => {
      await Asset.loadAsync([background, logo, blob]);
      setIsBackgroundReady(true);
    };
    preloadImages();
  }, []);

  return (
    <View style={styles.container}>
      {isBackgroundReady ? (
        <ImageBackground
          source={background}
          resizeMode="cover"
          style={styles.background}
        >
          <View style={styles.avatar}>
            <Pressable onPress={() => navigation.navigate("Settings")}>
              <Avatar icon="menu" color={"white"} size={50} bgColor="#212529" />
            </Pressable>
          </View>

          <View style={styles.ads}>
            <AdCarousel data={ads} />
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => handleNavigate("Gallery")}>
                <ImageBackground source={blob} style={styles.blob}>
                  <MaterialCommunityIcons name="image" size={40} color="#fff" />
                  <Text
                    variant="small"
                    value={"Gallery"}
                    style={{ color: "#fff" }}
                  />
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleModal}>
                <ImageBackground source={blob} style={styles.blob}>
                  <Entypo name="mobile" size={40} color="#fff" />
                  <Text
                    variant="small"
                    value={"Socials"}
                    style={{ color: "#fff" }}
                  />
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={() => Linking.openURL("https://ticketraha.com/events")}
                onPress={() => handleNavigate("Events")}
              >
                <ImageBackground source={blob} style={styles.blob}>
                  <MaterialCommunityIcons
                    name="ticket"
                    size={40}
                    color="#fff"
                  />
                  <Text
                    variant="small"
                    value={"Buy Tickets"}
                    style={{ color: "#fff" }}
                  />
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>

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
                  onPress={() =>
                    Linking.openURL("https://twitter.com/raha_fest")
                  }
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
          <StatusBar style="light" />
        </ImageBackground>
      ) : (
        <View style={styles.loader}>
          <Text>Loading...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212529",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  section: {
    flex: 1,
    marginTop: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 100,
  },
  ads: {
    position: "absolute",
    top: 100,
    zIndex: 100,
    // backgroundColor: "white",
    height: 100,
    width: Dimensions.get("window").width,
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#212529",
  },
});
