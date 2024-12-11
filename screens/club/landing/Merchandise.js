import { StyleSheet, FlatList } from "react-native";
import { MerchCard, Text } from "../../../components";
import { products } from "../../../data";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

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
      <StatusBar style="light" />
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
