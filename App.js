import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Routes from "./navigation/routes";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <View style={styles.container}>
          <Routes />
          <StatusBar style="auto" />
        </View>
      </PaperProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
