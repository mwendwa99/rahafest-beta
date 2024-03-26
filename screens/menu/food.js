import React from "react";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";

const homegrown = [
  {
    name: "Smokies + Fries",
    price: "350",
  },
  {
    name: "Mayai Pasua",
    price: "50",
  },
  {
    name: "Chicken Mshikaki + Fries",
    price: "500",
  },
  {
    name: "Beef Mshikaki + Fries",
    price: "500",
  },
  {
    name: "Plain Fries",
    price: "250",
  },
  {
    name: "Shawarma",
    price: "500",
  },
];

const chomaZone = [
  {
    name: "Goat Choma (1kg; 1/2kg; 1/4kg) + Fries",
    price: "1400; 750; 400",
  },
  {
    name: "Beef Choma (1kg; 1/2kg; 1/4kg) + Fries",
    price: "1300; 650; 300",
  },
  {
    name: "Chicken Choma (Full; Half; Quater) + Fries",
    price: "1500; 750; 400",
  },
  {
    name: "Choma Sausage(2 pieces)",
    price: "500",
  },
];

const continental = [
  {
    name: "Wings + Fries",
    price: "600",
  },
  {
    name: "Hot Dogs + Fries",
    price: "700",
  },
  {
    name: "Beef Burger",
    price: "800",
  },
];

const vanguardLogo = require("../../assets/images/VANGUARDLOGOFINAL.jpeg");
const Bg = require("../../assets/images/istockphoto-518037033-170667a-1.webp");
const Food = () => {
  const { menu } = useSelector((state) => state.menu);
  // console.log(menu);
  const itemsBySubcategory = {};
  menu.forEach(item => {
      const subcategoryName = item.subcategory.name;
      if (!itemsBySubcategory[subcategoryName]) {
          itemsBySubcategory[subcategoryName] = [];
      }
      itemsBySubcategory[subcategoryName].push(item);
  });

  // Log the items grouped by subcategory
  Object.keys(itemsBySubcategory).forEach(subcategory => {
      console.log(`Subcategory: ${subcategory}`);
      itemsBySubcategory[subcategory].forEach(item => {
          console.log(`- ${item.name}`);
      });
  });

  return (
    <ImageBackground
      source={Bg}
      style={{ flex: 1, position: "relative", marginTop: 0, height: "30%" }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.imgWrapper}>
          <Image
            style={styles.img}
            source={vanguardLogo}
          />
        </View>
        <View style={styles.menuContainer}>
          <View style={styles.menuWrapper}>
            <Text style={styles.menu}>MENU</Text>
          </View>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.food}>
              {/* <View> */}
              <View>
                <Text style={styles.category}>Homegrown</Text>
                {homegrown.map((item, index) => (
                  <Text key={index}>
                    {item.name} ...... {item.price}
                  </Text>
                ))}
              </View>

              <View style={{ marginTop: 30 }}>
                <Text style={styles.category}>chomaZone</Text>
                <Text>Goat Choma(+Fries)</Text>
                <Text style={styles.quantity}> 1kg ...... 1400</Text>
                <Text style={styles.quantity}> 1/2kg ...... 750</Text>
                <Text style={styles.quantity}> 1/4kg ...... 400</Text>

                <Text>Beef Choma(+Fries)</Text>
                <Text style={styles.quantity}> 1kg ...... 1300</Text>
                <Text style={styles.quantity}> 1/2kg ...... 650</Text>
                <Text style={styles.quantity}> 1/4kg ...... 300</Text>

                <Text>Chicken Choma(+Fries)</Text>
                <Text style={styles.quantity}> 1kg ...... 1500</Text>
                <Text style={styles.quantity}> 1/2kg ...... 750</Text>
                <Text style={styles.quantity}> 1/4kg ...... 400</Text>

                <Text>Choma Sausage(2 pieces) ...... 500</Text>

                {/* {chomaZone.map((item, index) => (
                  <Text key={index}>
                    {item.name} ...... {item.price}
                  </Text>
                ))} */}
              </View>

              <View style={{ marginTop: 30, marginBottom: 30 }}>
                <Text style={styles.category}>continental</Text>
                {continental.map((item, index) => (
                  <Text key={index}>
                    {item.name} ...... {item.price}
                  </Text>
                ))}
              </View>
              {/* </View> */}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
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


//import React, { useEffect, useState } from "react";
//import {
//  Image,
//  ImageBackground,
//  SafeAreaView,
//  ScrollView,
//  StyleSheet,
//  Text,
//  View,
//  RefreshControl,
//} from "react-native";
//import { useDispatch, useSelector } from "react-redux";
//import { getMenu } from "../../redux/menu/menuActions";
//import { StatusBar } from "expo-status-bar";
//
//const splash = require("../../assets/splash.png");
//const background = require("../../assets/images/istockphoto-518037033-170667a-1.webp");
//const vanguardLogo = require("../../assets/images/VANGUARDLOGOFINAL.jpeg");
//
//const Food = () => {
//  const dispatch = useDispatch();
//  const { menu, loading } = useSelector((state) => state.menu);
//  const [refreshing, setRefreshing] = useState(false);
//
//  const onRefresh = () => {
//    setRefreshing(true);
//    dispatch(getMenu());
//    setRefreshing(false);
//  };
//
//  useEffect(() => {
//    dispatch(getMenu());
//  }, [dispatch]);
//
//  // Group menu items by subcategory
//  const groupedMenu = menu.reduce((acc, item) => {
//    const subcategory = item.subcategory.name;
//    if (!acc[subcategory]) {
//      acc[subcategory] = [];
//    }
//    acc[subcategory].push(item);
//    return acc;
//  }, {});
//
//  if (loading) {
//    return (
//      <ImageBackground
//        source={splash}
//        style={{ flex: 1, justifyContent: "center" }}
//      >
//        <StatusBar style="light" />
//      </ImageBackground>
//    );
//  }
//
//  return (
//    <ImageBackground
//      source={background}
//      style={{ flex: 1, position: "relative", marginTop: 0, height: "30%" }}
//    >
//      <SafeAreaView style={styles.container}>
//        <View style={styles.imgWrapper}>
//          <Image style={styles.img} source={vanguardLogo} />
//        </View>
//        <View style={styles.menuContainer}>
//          <View style={styles.menuWrapper}>
//            <Text style={styles.menu}>MENU</Text>
//          </View>
//          <ScrollView
//            style={{ flex: 1 }}
//            refreshControl={
//              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//            }
//          >
//            <View style={styles.food}>
//              {Object.entries(groupedMenu).map(([subcategory, items]) => (
//                <View key={subcategory} style={{ marginTop: 30 }}>
//                  <Text style={styles.category}>{subcategory}</Text>
//                  {items.map((item, index) => (
//                    <View
//                      key={index}
//                      style={{
//                        borderBottomWidth: 1,
//                        borderColor: "grey",
//                        borderStyle: "dashed",
//                        paddingVertical: 10,
//                      }}
//                    >
//                      <Text key={index}>
//                        {item.name} - {item.price}
//                      </Text>
//                      <Text>{item.description}</Text>
//                    </View>
//                  ))}
//                </View>
//              ))}
//            </View>
//          </ScrollView>
//        </View>
//      </SafeAreaView>
//      <StatusBar style="light" />
//    </ImageBackground>
//  );
//};
//export default Food;
//
//const styles = StyleSheet.create({
//  container: {
//    flex: 1,
//    flexDirection: "column",
//  },
//  imgWrapper: {
//    marginLeft: 60,
//    width: "30%",
//    height: "32%",
//    backgroundColor: "#bc4a0d",
//  },
//  menuContainer: {
//    position: "relative",
//    display: "flex",
//    flexDirection: "row",
//    flex: 1,
//  },
//  food: {
//    width: "100%",
//    zIndex: 99,
//  },
//  category: {
//    fontWeight: "bold",
//    fontSize: 24,
//    textTransform: "uppercase",
//  },
//  img: {
//    flex: 1,
//    width: "100%",
//    objectFit: "contain",
//  },
//  menuWrapper: {
//    width: "30%",
//    alignItems: "center",
//    justifyContent: "center",
//  },
//  menu: {
//    fontSize: 40,
//    fontWeight: "bold",
//    transform: [{ rotate: "270deg" }],
//    textAlign: "center",
//  },
//  quantity: {
//    left: 5,
//  },
//});
