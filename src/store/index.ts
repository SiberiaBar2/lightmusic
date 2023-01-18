import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// import userInfoSlice from '@/store/slice/userInfoSlice'
// import SimpleData from '@/store/slice/asyncSlice'

import playReducer from "./play";
import loginReducer from "./login";

const rootReducer = combineReducers({
  play: playReducer,
  login: loginReducer,
});

// 状态持久化配置
const persistConfig = {
  key: "root",
  storage,
  // blacklist: ["modalInfo", "userInfoSlice", "SimpleData"], // 写在这块的数据不会存在storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
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
