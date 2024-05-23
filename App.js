import "react-native-gesture-handler";

import Routes from "./navigation/routes";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootSiblingParent } from "react-native-root-siblings";

import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import splash from "./assets/splash.png";
import { ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate
        persistor={persistor}
        loading={
          <ImageBackground
            source={splash}
            style={{ flex: 1, justifyContent: "center", height: "100vh" }}
          >
            <StatusBar style="light" />
          </ImageBackground>
        }
      >
        <NavigationContainer>
          <PaperProvider>
            <SafeAreaProvider>
              <RootSiblingParent>
                <Routes />
              </RootSiblingParent>
            </SafeAreaProvider>
          </PaperProvider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
