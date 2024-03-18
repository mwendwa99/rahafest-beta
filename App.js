import "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "react-native";

import Routes from "./navigation/routes";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";

import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <PaperProvider>
            <View style={styles.container}>
              <Routes />
              <StatusBar barStyle="light-content" />
            </View>
          </PaperProvider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
  // return (
  //   <Provider store={store}>
  //       <NavigationContainer>
  //         <PaperProvider>
  //           <SafeAreaView style={styles.container}>
  //             <Routes />
  //             <StatusBar style="auto" />
  //           </SafeAreaView>
  //         </PaperProvider>
  //       </NavigationContainer>
  //    </Provider>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
