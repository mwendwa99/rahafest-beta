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

const Drinks = () => {
  return (
    <ImageBackground
      source={require("../../assets/images/BarMenu.png")}
      style={{ flex: 1, position: "relative", marginTop: 0, height: "30%" }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.categoryWrapper}>
            <Text style={styles.category}>Cocktails</Text>
            <View style={styles.subCategory}>
              <Text style={styles.subCategoryTxt}>Original Vanguard</Text>
              <View>
                <Text style={styles.drink}>- Jameson</Text>
                <Text style={styles.drink}>- Tonic water</Text>
                <Text style={styles.drink}>- Elderflower Cordial</Text>
              </View>
            </View>
            <View style={styles.subCategory}>
              <Text style={styles.subCategoryTxt}>Raha Cooler</Text>
              <View>
                <Text style={styles.drink}>- Glenlivet Founders</Text>
                <Text style={styles.drink}>- Ginger Ale</Text>
              </View>
            </View>
            <View style={styles.subCategory}>
              <Text style={styles.subCategoryTxt}>Martel Old Fashioned</Text>
              <View>
                <Text style={styles.drink}>- Martel VS</Text>
                <Text style={styles.drink}>- Angostura</Text>
                <Text style={styles.drink}>- Granulated Sugar</Text>
                <Text style={styles.drink}>- Orange Twist</Text>
              </View>
            </View>
            <View style={styles.subCategory}>
              <Text style={styles.subCategoryTxt}>The Celeb</Text>
              <View>
                <Text style={styles.drink}>- Chivas XV</Text>
                <Text style={styles.drink}>- Grape Fruit Soda</Text>
              </View>
            </View>
            <View style={styles.subCategory}>
              <Text style={styles.subCategoryTxt}>Rum and Coke</Text>
              <View>
                <Text style={styles.drink}>- Captain Morgan</Text>
                <Text style={styles.drink}>- Coke</Text>
              </View>
            </View>
          </View>

          <View style={styles.categoryWrapper}>
            <Text style={styles.category}>local beers</Text>
            <View style={styles.subCategory}>
              <Text style={styles.beer}>Tusker ......... 300</Text>
              <Text style={styles.beer}>White Cup ...... 300</Text>
              <Text style={styles.beer}>Balozi ......... 300</Text>
            </View>
          </View>

          <View style={[styles.categoryWrapper, styles.beerCider]}>
            <Text style={styles.category}>other beers & ciders</Text>
            <View style={styles.subCategory}>
              <Text style={styles.beer}>Heineken ....... 400</Text>
              <Text style={styles.beer}>Desperado ...... 400</Text>
              <Text style={styles.beer}>Savanna ........ 400</Text>
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
