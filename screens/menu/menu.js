import { Text, View, useWindowDimensions } from "react-native";
import { StyleSheet } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import Drinks from "./drinks";
import Food from "./food";
import { useState } from "react";

const scene = SceneMap({
    drinks: Drinks,
    food: Food,
});

export default function MenuScreen (){
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes, useRoutes] = useState([
        { key: "food", title: "Food" },
        { key: "drinks", title: "Drinks" },
    ]);
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
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    tabview: {
        flex: 1,
    }
})