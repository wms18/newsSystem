/*
 * @Descripttion:
 * @version: X3版本
 * @Author: 吴毛三
 * @Date: 2022-01-30 22:00:33
 * @LastEditors: 吴毛三
 * @LastEditTime: 2022-02-12 23:03:29
 */
export const CollApsedReducer = (
  prevState = { isCollApsed: false },
  action
) => {
  let { type } = action;
  switch (type) {
    case "change_collapsed":
      let newState = { ...prevState };
      newState.isCollApsed = !newState.isCollApsed;
      return newState;
    default:
      return prevState;
  }
};
