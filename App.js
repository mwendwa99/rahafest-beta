import "react-native-gesture-handler";

import Main from "./screens";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootSiblingParent } from "react-native-root-siblings";

import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import splash from "./assets/splash.png";
import { ImageBackground, StatusBar } from "react-native";
import { theme } from "./theme";
import { CartProvider } from "./context/CartContext";
import NotificationsContainer from "./Notifications";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate
        persistor={persistor}
        loading={
          <ImageBackground
            source={splash}
            style={{ flex: 1, justifyContent: "center" }}
          >
            <StatusBar style="light" />
          </ImageBackground>
        }
      >
        <NotificationsContainer>
          <CartProvider>
            <NavigationContainer>
              <PaperProvider theme={theme}>
                <SafeAreaProvider>
                  <RootSiblingParent>
                    <Main />
                  </RootSiblingParent>
                </SafeAreaProvider>
              </PaperProvider>
            </NavigationContainer>
          </CartProvider>
        </NotificationsContainer>
      </PersistGate>
      <StatusBar barStyle="light-content" />
    </Provider>
  );
}
