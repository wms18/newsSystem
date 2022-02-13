/*
 * @Descripttion:
 * @version: X3版本
 * @Author: 吴毛三
 * @Date: 2022-01-30 21:53:55
 * @LastEditors: 吴毛三
 * @LastEditTime: 2022-02-13 22:53:00
 */
import { createStore, combineReducers } from "redux";
import { CollApsedReducer } from "./reducers/CollApsedReducer";
import { LoadingReducer } from "./reducers/LoadingReducer";
const reducer = combineReducers({
  CollApsedReducer,
  LoadingReducer,
});
const store = createStore(reducer);
export default store;
