import { useEffect } from "react";
import { View, StyleSheet, FlatList, ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { getNews } from "../../redux/news/newsActions";

import { Card } from "../../components";

const splash = require("../../assets/splash.png");

export default function News({ navigation }) {
  const dispatch = useDispatch();
  const { news, loading } = useSelector((state) => state.news);

  // console.log({ news });

  useEffect(() => {
    dispatch(getNews());
  }, []);

  if (loading) {
    return (
      <ImageBackground
        source={splash}
        style={{ flex: 1, justifyContent: "center" }}
      >
        <StatusBar style="light" />
      </ImageBackground>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        // data={[...news].reverse()} // Create a copy of news array, reverse it, and pass to FlatList
        data={news} // Create a copy of news array, reverse it, and pass to FlatList
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            image={item.image}
            description={item.description}
            active={item.active}
          />
        )}
      />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#212529",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
