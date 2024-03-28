import { StyleSheet, useWindowDimensions, Text, View } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Drinks from "./drinks";
import food from "./food";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMenu } from "../../redux/menu/menuActions";
import { getCategory } from "../../utils/helper";

const scene = SceneMap({
  drinks: Drinks,
  food: food
});

// Render tab bar
const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={tabStyles.indicator}
    style={tabStyles.tabBar}
    renderLabel={({ route, focused }) => (
      <Text style={[tabStyles.label, focused && tabStyles.labelFocused]}>
        {route.title}
      </Text>
    )}
  />
);

export default function Menu({ navigation }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const {menu} = useSelector(state => state.menu)
  const [category, setCategory] = useState([])
  const [routes, setRoutes] = useState([
    { key: "food", title: "Food"},
    { key: "drinks", title: "Drinks" },
  ]);

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getMenu());
  },[dispatch]);

  // useEffect(()=>{
  //   if(menu){
  //     const val = getCategory(menu)
  //     setCategory(val)
  //   }
  // },[menu]);

  // console.log("MENU::\t",menu)


  const handleIndexChange = (selectedIndex) => {
    if (selectedIndex >= 0 && selectedIndex < routes.length) {
      setIndex(selectedIndex);
    } else {
      console.error("Invalid index provided:", selectedIndex);
    }
  };

  return(
    <TabView
      style={styles.tabview}
      navigationState={{ index, routes }}
      renderScene={scene}
      onIndexChange={handleIndexChange}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
);
}

const tabStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#212529",
  },
  indicator: {
    backgroundColor: "#fafafa",
  },
  label: {
    color: "#c3c3c3",
  },
  labelFocused: {
    color: "white",
  },
});

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
  },
  tabview: {
      flex: 1,
  }
});




//import { StyleSheet, useWindowDimensions, Text, View } from "react-native";
//import { TabView, SceneMap, TabBar } from "react-native-tab-view";
//import Drinks from "./drinks";
//import food from "./food";
//import { useEffect, useState } from "react";
//import { useSelector, useDispatch } from "react-redux";
//import { getMenu } from "../../redux/menu/menuActions";
//import { getCategory } from "../../utils/helper";
//import Food from "./food";
//
//const scene = SceneMap({
//  drinks: Drinks,
//  food: food
//});
//
//  // Render tab bar
//  const renderTabBar = (props) => (
//    <TabBar
//      {...props}
//      indicatorStyle={tabStyles.indicator}
//      style={tabStyles.tabBar}
//      renderLabel={({ route, focused }) => (
//        <Text style={[tabStyles.label, focused && tabStyles.labelFocused]}>
//          {route.title}
//        </Text>
//      )}
//    />
//  );
//
//export default function Menu({ navigation }) {
//  const layout = useWindowDimensions();
//  const [index, setIndex] = useState(0);
//  const {menu} = useSelector(state => state.menu)
//  const [category, setCategory] = useState([])
//  const [routes, setRoutes] = useState([
//    { key: "food", title: "Food"},
//    { key: "drinks", title: "Drinks" },
//  ]);
//
//  const dispatch = useDispatch()
//
//  useEffect(()=>{
//    dispatch(getMenu())
//  },[])
//
//  useEffect(()=>{
//    if(menu){
//      const val = getCategory(menu)
//      setCategory(val)
//    }
//  },[menu])
//
//  const handleIndexChange = (selectedIndex) => {
//    if (selectedIndex >= 0 && selectedIndex < routes.length) {
//      setIndex(selectedIndex);
//    } else {
//      console.error("Invalid index provided:", selectedIndex);
//    }
//  };
//
//  // console.log({category})
//
//
//  return(
//  //     <TabView
//  //     style={styles.tabview}
//  //     navigationState={{ index, routes }}
//  //     renderScene={scene}
//  //     onIndexChange={handleIndexChange}
//  //     initialLayout={{ width: layout.width }}
//  //     renderTabBar={renderTabBar}
//  // />
//  <View style={{flex:1}}>
//    <Food/>
//  </View>
//
//);
//}
//
//
//const tabStyles = StyleSheet.create({
//  tabBar: {
//    backgroundColor: "#212529",
//  },
//  indicator: {
//    backgroundColor: "#fafafa",
//  },
//  label: {
//    color: "#c3c3c3",
//  },
//  labelFocused: {
//    color: "white",
//  },
//});
//
//const styles = StyleSheet.create({
//  container: {
//      flex: 1,
//      alignItems: "center",
//      justifyContent: "center",
//  },
//  tabview: {
//      flex: 1,
//  }
//});
//
