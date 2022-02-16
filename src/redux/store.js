/*
 * @Descripttion:
 * @version: X3版本
 * @Author: 吴毛三
 * @Date: 2022-01-30 21:53:55
 * @LastEditors: 吴毛三
 * @LastEditTime: 2022-02-16 21:39:28
 */
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { createStore, combineReducers } from "redux";
import { CollApsedReducer } from "./reducers/CollApsedReducer";
import { LoadingReducer } from "./reducers/LoadingReducer";
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["LoadingReducer"],
};
const reducer = combineReducers({
  CollApsedReducer,
  LoadingReducer,
});
const persistedReducer = persistReducer(persistConfig, reducer);
let store = createStore(persistedReducer);
let persistor = persistStore(store);
export { store, persistor };
