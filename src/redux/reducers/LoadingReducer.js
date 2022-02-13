/*
 * @Descripttion:
 * @version: X3版本
 * @Author: 吴毛三
 * @Date: 2022-01-30 22:00:33
 * @LastEditors: 吴毛三
 * @LastEditTime: 2022-02-13 22:51:27
 */
export const LoadingReducer = (prevState = { isLoading: false }, action) => {
  let { type } = action;
  switch (type) {
    case "change_loading":
      let newState = { ...prevState };
      newState.isLoading = !newState.isLoading;
      return newState;
    default:
      return prevState;
  }
};
