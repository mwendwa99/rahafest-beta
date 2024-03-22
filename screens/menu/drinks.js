import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  FlatList,
  RefreshControl,
  ScrollView
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getMenu } from "../../redux/menu/menuActions";

const background = require("../../assets/images/BarMenu.png");
const vanguardLogo = require("../../assets/images/barbottom.png");

const Drinks = () => {
  const dispatch = useDispatch();
  const { menu, loading } = useSelector((state) => state.menu);
  const [LocalBeers, setLocalBeers] = useState(null);
  const [Whisky, setWhisky] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getMenu());
    setRefreshing(false);
  };

  useEffect(() => {
    const whisky = menu?.filter(item => item.subcategory.name === "Whisky");
    setWhisky(whisky);
  },[]);

  useEffect(() => {
    const localBeers = menu?.filter(item => item.subcategory.name === "Local beers");
    setLocalBeers(localBeers);
  },[]);

  const renderSubCategory = ({ item }) => (
    <View style={{ marginTop: 30 }}>
      <Text style={{ color: "black", fontSize: 30 }}>{item.name}</Text>
      <FlatList
        style={{ maxHeight: 100 }}
        data={item.items}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
  
  const renderItem = ({ item }) => (
    <View style={{ marginTop: 30 }}>
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: "grey",
          borderStyle: "dashed",
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: "#000" }}>
          {item?.name} - {item?.price}
        </Text>
        <Text>{item?.description}</Text>
      </View>
    </View>
  );
  console.log(LocalBeers);
  return (
    <ImageBackground
      source={background}
      style={{ flex: 1, position: "relative", marginTop: 0, height: "30%" }}>
        {LocalBeers &&
          <Text style={{color: "black", fontSize: 30}}>Local Beers</Text>
        }
          <FlatList
          style={{maxHeight:100}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> 
          }
          data={LocalBeers}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          />

        {Whisky &&
          <Text style={{color: "black", fontSize: 30}}>Whisky</Text>
        }
          <FlatList
        style={{maxHeight:100}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> 
          }
          data={Whisky}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      <Image
        style={styles.bottomImg}
        source={vanguardLogo}
      />
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
