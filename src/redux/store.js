/*
 * @Descripttion:
 * @version: X3版本
 * @Author: 吴毛三
 * @Date: 2022-01-30 21:53:55
 * @LastEditors: 吴毛三
 * @LastEditTime: 2022-01-30 22:04:19
 */
import { createStore,combineReducers } from "redux";
import { CollApsedReducer } from "./reducers/CollApsedReducer";
const reducer =combineReducers({
    CollApsedReducer
})
const store = createStore(reducer);
export default store;
