import { View, ImageBackground, StyleSheet, StatusBar } from "react-native";

const background = {
  uri: "https://api.rahafest.com/media_files/banners/background.png",
};

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
