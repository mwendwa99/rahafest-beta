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
import eventsSlice from "./events/eventsSlice"
import ticketsSlice from "./tickets/ticketsSlice";
import walletSlice from "./wallet/walletSlice";
import transactionsSlice from "./transactions/transactionsSlice";
import pointsSlice from "./points/pointsSlice";

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
  events: eventsSlice,
  tickets: ticketsSlice,
  wallet: walletSlice,
  transactions: transactionsSlice,
  points: pointsSlice
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
