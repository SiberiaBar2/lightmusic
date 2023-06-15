import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

import playReducer from "./play";
import loginReducer from "./login";
import songsReducer from "./songs";
import ilikeReducer from "./ilike";
import picturlReducer from "./picturl";

const rootReducer = combineReducers({
  play: playReducer,
  login: loginReducer,
  songs: songsReducer,
  ilike: ilikeReducer,
  picturl: picturlReducer,
});

// 状态持久化配置
const persistConfig = {
  key: "root",
  storage,
  version: 1,
  // 注意： 这里的黑名单是 playSlice 的 name 值 ; 写在这块的数据不会存在storage
  blacklist: ["play"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 如果使用 Redux-Persist，你应该特别忽略它分发的所有动作类型：
// https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// 持久化store
export const persist = persistStore(store);

export default store;
