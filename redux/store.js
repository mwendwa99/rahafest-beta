import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
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
  whitelist: ["auth", "faq", "lineup", "news", "menu"],
  blacklist: ["chat", "friends"],
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
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
