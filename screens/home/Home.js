import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5, Entypo, Ionicons } from "@expo/vector-icons";

import { Text, CText } from "../../components";

const image = require("../../assets/background.webp");
const logo = require("../../assets/logo.png");
const blob = require("../../assets/blob.png");

export default function Home() {
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
            <TouchableOpacity>
              <ImageBackground source={blob} style={styles.blob}>
                <FontAwesome5 name="headphones-alt" size={40} color="#fff" />
                <Text variant="small" value={"Playlist"} color="#fff" />
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity>
              <ImageBackground source={blob} style={styles.blob}>
                <Entypo name="mobile" size={40} color="#fff" />
                <Text variant="small" value={"Socials"} color="#fff" />
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity>
              <ImageBackground source={blob} style={styles.blob}>
                <Ionicons name="people-sharp" size={40} color="#fff" />
                <Text variant="small" value={"Playlist"} color="#fff" />
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
});
