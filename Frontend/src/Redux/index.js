import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice";
import tweetSlice from "./Slices/tweetSlice";
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
import storage from "redux-persist/lib/storage";

// Configuration for redux-persist
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  // whitelist: ["user"],
  // blacklist: ["tweet", "user"],
};

// Combine reducers
const rootReducer = combineReducers({
  user: userSlice,
  tweet: tweetSlice,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create the persistor
const persistor = persistStore(store);

// Export store and persistor
export { store, persistor };
