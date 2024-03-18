import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getMenu } from "../../redux/menu/menuActions";
import { StatusBar } from "expo-status-bar";

const splash = require("../../assets/splash.png");
const background = require("../../assets/images/istockphoto-518037033-170667a-1.webp");
const vanguardLogo = require("../../assets/images/VANGUARDLOGOFINAL.jpeg");

const Food = () => {
  const dispatch = useDispatch();
  const { menu, loading } = useSelector((state) => state.menu);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getMenu());
    setRefreshing(false);
  };

  useEffect(() => {
    dispatch(getMenu());
  }, [dispatch]);

  // Group menu items by subcategory
  const groupedMenu = menu.reduce((acc, item) => {
    const subcategory = item.subcategory.name;
    if (!acc[subcategory]) {
      acc[subcategory] = [];
    }
    acc[subcategory].push(item);
    return acc;
  }, {});

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
    <ImageBackground
      source={background}
      style={{ flex: 1, position: "relative", marginTop: 0, height: "30%" }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.imgWrapper}>
          <Image style={styles.img} source={vanguardLogo} />
        </View>
        <View style={styles.menuContainer}>
          <View style={styles.menuWrapper}>
            <Text style={styles.menu}>MENU</Text>
          </View>
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={styles.food}>
              {Object.entries(groupedMenu).map(([subcategory, items]) => (
                <View key={subcategory} style={{ marginTop: 30 }}>
                  <Text style={styles.category}>{subcategory}</Text>
                  {items.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        borderBottomWidth: 1,
                        borderColor: "grey",
                        borderStyle: "dashed",
                        paddingVertical: 10,
                      }}
                    >
                      <Text key={index}>
                        {item.name} - {item.price}
                      </Text>
                      <Text>{item.description}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </ImageBackground>
  );
};
export default Food;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  imgWrapper: {
    marginLeft: 60,
    width: "30%",
    height: "32%",
    backgroundColor: "#bc4a0d",
  },
  menuContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    flex: 1,
  },
  food: {
    width: "100%",
    zIndex: 99,
  },
  category: {
    fontWeight: "bold",
    fontSize: 24,
    textTransform: "uppercase",
  },
  img: {
    flex: 1,
    width: "100%",
    objectFit: "contain",
  },
  menuWrapper: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  menu: {
    fontSize: 40,
    fontWeight: "bold",
    transform: [{ rotate: "270deg" }],
    textAlign: "center",
  },
  quantity: {
    left: 5,
  },
});
