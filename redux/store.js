import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import faqSlice from "./faq/faqSlice";
import authSlice from "./auth/authSlice";
import lineupSlice from "./lineup/lineupSlice";
import newsSlice from "./news/newsSlice";
import menuSlice from "./menu/menuSlice";
import chatSlice from "./chat/chatSlice";
import friendSlice from "./friends/friendSlice";

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
  news: newsSlice,
  menu: menuSlice,
  chat: chatSlice,
  friends: friendSlice,
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
