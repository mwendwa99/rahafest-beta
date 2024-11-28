import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";

import authReducer from "./auth/authSlice";
import appReducer from "./app/appSlice";

// Configure persist storage
const persistConfig = {
  key: "auth",
  storage: AsyncStorage,
};

// Persisted reducer for auth
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Store configuration
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
