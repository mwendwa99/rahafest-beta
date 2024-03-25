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

const Food = () => {
  return (
    <ImageBackground
      source={require("../../assets/images/istockphoto-518037033-170667a-1.webp")}
      style={{ flex: 1, position: "relative", marginTop: 0, height: "30%" }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.imgWrapper}>
          <Image
            style={styles.img}
            source={require("../../assets/images/VANGUARDLOGOFINAL.jpeg")}
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
    // backgroundColor:"yellow"
    // left: -60,
    // marginTop: "30%"
  },
  food: {
    // left: -60,
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
    width: "44%",
    // position: "relative",
    // height: "10%",
    // flex: 1,
    // left: -10,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "green"
  },
  menu: {
    fontSize: 65,
    fontWeight: "bold",
    transform: [{ rotate: "270deg" }],
    // marginLeft: 0,
    // left: 0,
    textAlign: "center",
    // backgroundColor: "purple",
  },
  quantity: {
    left: 5,
  },
});
