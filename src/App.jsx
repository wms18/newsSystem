/*
 * @Descripttion:
 * @version: X3版本
 * @Author: 吴毛三
 * @Date: 2022-01-16 00:15:20
 * @LastEditors: 吴毛三
 * @LastEditTime: 2022-01-30 22:10:25
 */
import IndexRouter from "./router/IndexRouter";
import { ConfigProvider } from "antd";
import zh_CN from "antd/es/locale/zh_CN";
import { Provider } from "react-redux";
import $ from "jquery";
import moment from "moment";
import "moment/locale/zh-cn";
import { Chat } from "./util/chat";
import store from "./redux/store";
moment.locale("zh-cn");

function App() {
  // let newPublic = Chat({
  //   x: "20px",
  //   y: "110px",
  //   username: "wms",
  //   systemName: "盛心赔",
  //   ws_url: "http://localhost:5000",
  // });
  // window.newPublic = newPublic;
  
  return (
    <ConfigProvider locale={zh_CN}>
      <Provider store={store}>
        <IndexRouter />
      </Provider>
    </ConfigProvider>
  );
}

export default App;
