import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import faqSlice from "./faq/faqSlice";
import authSlice from "./auth/authSlice";
import lineupSlice from "./lineup/lineupSlice";

const rootPersistConfig = {
  key: "root",
  storage: AsyncStorage,
  keyPrefix: "redux-",
  whitelist: [],
};

const rootReducer = combineReducers({
  auth: authSlice,
  faq: faqSlice,
  lineup: lineupSlice,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
