import "react-native-gesture-handler";
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
            <Routes />
            <StatusBar barStyle="light-content" />
          </PaperProvider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
