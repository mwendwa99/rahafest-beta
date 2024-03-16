import { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";

import { Text, Artist } from "../../components";
import { getLineup } from "../../redux/lineup/lineupActions";
import { filterAndSortLineup } from "../../utils/helper";

const splash = require("../../assets/splash.png");

export default function Schedule() {
  const dispatch = useDispatch();
  const { lineup, loading, lineupError } = useSelector((state) => state.lineup);
  const [day1Data, setDay1Data] = useState([]);
  const [day2Data, setDay2Data] = useState([]);

  useEffect(() => {
    dispatch(getLineup());
  }, [dispatch]);

  // console.log(lineup, loading, lineupError);

  // console.log("Lineup:", lineup);

  // Output the results when lineup data is fetched
  useEffect(() => {
    if (lineup && !loading) {
      // Filter and sort data for Day 1
      const day1Data = filterAndSortLineup("1", "Davido", lineup);

      // Filter and sort data for Day 2
      const day2Data = filterAndSortLineup("2", "King Promise", lineup);

      setDay1Data(day1Data);
      setDay2Data(day2Data);
    }
  }, [lineup, loading]);

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
      <View style={styles.column}>
        <Text variant={"subtitle"} value={"Day 1"} />
        <FlatList
          data={day1Data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Artist artist={item} feature="davido" />}
        />
      </View>
      <View style={styles.column}>
        <Text variant={"subtitle"} value={"Day 2"} />
        <FlatList
          data={day2Data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Artist artist={item} feature="kingpromise" />
          )}
        />
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#212529",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  column: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
