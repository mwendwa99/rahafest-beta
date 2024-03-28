import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ScrollView,
} from "react-native";

const local = [
  {
  name: "Tusker/Tusker malt/Tusker Lite",
  price: "350"
  },
  {
    name: "White Cap",
    price: "350"
  },
  {
    name: "Guiness",
    price: "350"
  },
  {
    name: "Manyatta",
    price: "400"
  }];

const inter = [{
    name: "Heineken 0.0",
    price: "350"
  },
  {
    name: "Heineken",
    price: "350"
  },
  {
    name: "Desperados",
    price: "400"
  },
  {
    name: "Savanna",
    price: "400"
  }];

const whisky = [{
    name: "Jameson Original 700ml",
    price: "4000"
  },
  {
    name: "Jameson Black barrel 700ml",
    price: "6500"
  },
  {
    name: "Jameson Original 350ml",
    price: "2800"
  }
];

const cognac = [
  {
    name: "Martel VS 700ml",
    price: "7000"
  },
  {
    name: "Martell Swift",
    price: "12000"
  },
  {
    name: "Martell Cordon",
    price: "20000"
  },
  {
    name: "Martell XO",
    price: "45000"
  }
];

const shots = [
  {
    name: "Absolut Vodka 700ml",
    price: "300"
  },
  {
    name: "Beefeater Gin 700ml",
    price: "300"
  },
  {
    name: "Beefeater Pink Gin",
    price: "300"
  },
  {
    name: "Olmecca 750ml ",
    price: "300"
  },
  {
    name: "Olmecca Gold 750 ml",
    price: "300"
  },
  {
    name: "Olmecca Fusion Choc 75ml",
    price: "300"
  },
  {
    name: "ameson Original 750ml",
    price: "300"
  },
  {
    name: "Jameson Black Barrell 750ml",
    price: "350"
  },
  {
    name: "Martell Vs 700ml ",
    price: "400"
  }
];

const champagne = [
  {
    name: "Mumm Champagne Cordon Rough Brut",
    price: "12500"
  },
  {
    name: "Mumm Champagne Cordon Rose",
    price: "12500"
  },
  {
    name: "Mumm Champagne Demi-Sec",
    price: "12500"
  },
];

const sparkling = [
  {
    name: "Luc Belaire Rose",
    price: "8500"
  },
  {
    name: "Luc Belaire Gold",
    price: "8500"
  },
  {
    name: "Luc Belaire Rose Fantome",
    price: "9500"
  },
  {
    name: "Luc Belaire Luxe",
    price: "8500"
  },
  {
    name: "Luc Belaire Rose 150cl",
    price: "14000"
  }
];

const softdrink = [
  {
    name: "Highlands water",
    price: "150"
  },
  {
    name: "Soda",
    price: "200"
  },
  {
    name: "Redbull",
    price: "350"
  },
];

const cocktails = [
  {
    name: "Jameson Original Cocktails",
    price: "400"
  },
  {
    name: "Jameson Black Barrel Cocktails",
    price: "500"
  },
  {
    name: "Jameson & Redbull ",
    price: "700"
  },
  {
    name: "Martell Vs Cocktail",
    price: "600"
  },
  {
    name: "Martell Swift Cocktail",
    price: "750"
  }
];

const Drinks = () => {
  return (
    <ImageBackground
      source={require("../../assets/images/BarMenu.png")}
      style={{ flex: 1, position: "relative", marginTop: 0, height: "30%" }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.categoryWrapper}>
            <Text style={styles.category}>Local Beers</Text>
            <View style={styles.subCategory}>
              {local.map((item, index) => (
              <View key={index}>
                <Text style={styles.drink}>
                  {item.name} ...... {item.price}
                </Text>
              </View>
              ))}
            </View>
          </View>

          <View style={styles.categoryWrapper}>
            <Text style={styles.category}>International Beers & Ciders</Text>
            <View style={styles.subCategory}>
              {inter.map((item, index) => (
              <View key={index}>
              <Text style={styles.drink}>
                  {item.name} ...... {item.price}
                </Text>
              </View>
              ))}
            </View>
          </View>

          <View style={styles.categoryWrapper}>
            <Text style={styles.category}>Whisky</Text>
            <View style={styles.subCategory}>
              {whisky.map((item, index) => (
              <View key={index}>
              <Text style={styles.drink}>
                  {item.name} ...... {item.price}
                </Text>
              </View>
              ))}
            </View>
          </View>

          <View style={styles.categoryWrapper}>
            <Text style={styles.category}>Cognac</Text>
            <View style={styles.subCategory}>
              {shots.map((item, index) => (
              <View key={index}>
              <Text style={styles.drink}>
                  {item.name} ...... {item.price}
                </Text>
              </View>
              ))}
            </View>
          </View>

          <View style={styles.categoryWrapper}>
            <Text style={styles.category}>Shots</Text>
            <View style={styles.subCategory}>
              {shots.map((item, index) => (
              <View key={index}>
              <Text style={styles.drink}>
                  {item.name} ...... {item.price}
                </Text>
              </View>
              ))}
            </View>
          </View>

          <View style={styles.categoryWrapper}>
            <Text style={styles.category}>Champagne</Text>
            <View style={styles.subCategory}>
              {champagne.map((item, index) => (
              <View key={index}>
              <Text style={styles.drink}>
                  {item.name} ...... {item.price}
                </Text>
              </View>
              ))}
            </View>
          </View>

          <View style={styles.categoryWrapper}>
            <Text style={styles.category}>Sparkling Wine</Text>
            <View style={styles.subCategory}>
              {sparkling.map((item, index) => (
              <View key={index}>
              <Text style={styles.drink}>
                  {item.name} ...... {item.price}
                </Text>
              </View>
              ))}
            </View>
          </View>

          <View style={styles.categoryWrapper}>
            <Text style={styles.category}>Soft Drinks</Text>
            <View style={styles.subCategory}>
              {softdrink.map((item, index) => (
              <View key={index}>
              <Text style={styles.drink}>
                  {item.name} ...... {item.price}
                </Text>
              </View>
              ))}
            </View>
          </View>

          <View style={[styles.categoryWrapper, styles.beerCider]}>
            <Text style={styles.category}>Cocktails</Text>
            <View style={styles.subCategory}>
              {cocktails.map((item, index) => (
              <View key={index}>
              <Text style={styles.drink}>
                  {item.name} ...... {item.price}
                </Text>
              </View>
              ))}
            </View>
          </View>
        </ScrollView>
        <Image
          style={styles.bottomImg}
          source={require("../../assets/images/barbottom.png")}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Drinks;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    marginTop: "58%",
    padding: 40,
    paddingBottom: 100,
  },
  categoryWrapper: {
    marginBottom: 30,
  },
  beerCider: {
    marginBottom: "70%",
  },
  category: {
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 24,
  },
  subCategory: {
    left: 15,
    marginBottom: 25,
  },
  subCategoryTxt: {
    fontSize: 20,
  },
  drink: {
    left: 15,
    fontSize: 16,
  },
  beer: {
    fontSize: 20,
  },
  bottomImg: {
    position: "absolute",
    flex: 1,
    bottom: -40,
    width: "100%",
    objectFit: "contain",
    zIndex: -1,
  },
});

//import React from "react";
//import {
//  SafeAreaView,
//  StyleSheet,
//  Text,
//  View,
//  ImageBackground,
//  Image,
//  ScrollView,
//} from "react-native";
//
//const Drinks = () => {
//  return (
//    <ImageBackground
//      source={require("../../assets/images/BarMenu.png")}
//      style={{ flex: 1, position: "relative", marginTop: 0, height: "30%" }}>
//      <SafeAreaView style={styles.safeArea}>
//        <ScrollView style={styles.scrollView}>
//          <View style={styles.categoryWrapper}>
//            <Text style={styles.category}>Cocktails</Text>
//            <View style={styles.subCategory}>
//              <Text style={styles.subCategoryTxt}>Original Vanguard</Text>
//              <View>
//                <Text style={styles.drink}>- Jameson</Text>
//                <Text style={styles.drink}>- Tonic water</Text>
//                <Text style={styles.drink}>- Elderflower Cordial</Text>
//              </View>
//            </View>
//            <View style={styles.subCategory}>
//              <Text style={styles.subCategoryTxt}>Raha Cooler</Text>
//              <View>
//                <Text style={styles.drink}>- Glenlivet Founders</Text>
//                <Text style={styles.drink}>- Ginger Ale</Text>
//              </View>
//            </View>
//            <View style={styles.subCategory}>
//              <Text style={styles.subCategoryTxt}>Martel Old Fashioned</Text>
//              <View>
//                <Text style={styles.drink}>- Martel VS</Text>
//                <Text style={styles.drink}>- Angostura</Text>
//                <Text style={styles.drink}>- Granulated Sugar</Text>
//                <Text style={styles.drink}>- Orange Twist</Text>
//              </View>
//            </View>
//            <View style={styles.subCategory}>
//              <Text style={styles.subCategoryTxt}>The Celeb</Text>
//              <View>
//                <Text style={styles.drink}>- Chivas XV</Text>
//                <Text style={styles.drink}>- Grape Fruit Soda</Text>
//              </View>
//            </View>
//            <View style={styles.subCategory}>
//              <Text style={styles.subCategoryTxt}>Rum and Coke</Text>
//              <View>
//                <Text style={styles.drink}>- Captain Morgan</Text>
//                <Text style={styles.drink}>- Coke</Text>
//              </View>
//            </View>
//          </View>
//
//          <View style={styles.categoryWrapper}>
//            <Text style={styles.category}>local beers</Text>
//            <View style={styles.subCategory}>
//              <Text style={styles.beer}>Tusker ......... 300</Text>
//              <Text style={styles.beer}>White Cup ...... 300</Text>
//              <Text style={styles.beer}>Balozi ......... 300</Text>
//            </View>
//          </View>
//
//          <View style={[styles.categoryWrapper, styles.beerCider]}>
//            <Text style={styles.category}>other beers & ciders</Text>
//            <View style={styles.subCategory}>
//              <Text style={styles.beer}>Heineken ....... 400</Text>
//              <Text style={styles.beer}>Desperado ...... 400</Text>
//              <Text style={styles.beer}>Savanna ........ 400</Text>
//            </View>
//          </View>
//        </ScrollView>
//        <Image
//          style={styles.bottomImg}
//          source={require("../../assets/images/barbottom.png")}
//        />
//      </SafeAreaView>
//    </ImageBackground>
//  );
//};
//
//export default Drinks;
//
//const styles = StyleSheet.create({
//  safeArea: {
//    flex: 1,
//  },
//  container: {
//    alignItems: "center",
//    flex: 1,
//    justifyContent: "center",
//  },
//  scrollView: {
//    flex: 1,
//    marginTop: "58%",
//    padding: 40,
//    paddingBottom: 100,
//  },
//  categoryWrapper: {
//    marginBottom: 30,
//  },
//  beerCider: {
//    marginBottom: "70%",
//  },
//  category: {
//    textTransform: "uppercase",
//    fontWeight: "bold",
//    fontSize: 24,
//  },
//  subCategory: {
//    left: 15,
//    marginBottom: 25,
//  },
//  subCategoryTxt: {
//    fontSize: 20,
//  },
//  drink: {
//    left: 15,
//    fontSize: 16,
//  },
//  beer: {
//    fontSize: 20,
//  },
//  bottomImg: {
//    position: "absolute",
//    flex: 1,
//    bottom: -40,
//    width: "100%",
//    objectFit: "contain",
//    zIndex: -1,
//  },
//});
