import { View, StyleSheet } from "react-native";
import { Text } from "../../components";
import { StatusBar } from "expo-status-bar";

export default function Menu({ navigation }) {
  return (
    <View style={styles.container}>
      <Text value="Menu ui here..." variant="subtitle" />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#212529",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
