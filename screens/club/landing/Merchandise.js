import { StyleSheet, SafeAreaView, FlatList } from "react-native";
import { MerchCard, Text } from "../../../components";
import { products } from "./data";
import { StatusBar } from "expo-status-bar";

export default function Merchandise() {
  return (
    <SafeAreaView style={styles.container}>
      <Text value={"Raha Shop"} variant={"subtitle"} />
      <FlatList
        data={products}
        renderItem={({ item }) => <MerchCard product={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
