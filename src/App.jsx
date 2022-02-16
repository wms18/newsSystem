/*
 * @Descripttion:
 * @version: X3版本
 * @Author: 吴毛三
 * @Date: 2022-01-16 00:15:20
 * @LastEditors: 吴毛三
 * @LastEditTime: 2022-02-16 21:28:49
 */
import IndexRouter from "./router/IndexRouter";
import { ConfigProvider } from "antd";
import zh_CN from "antd/es/locale/zh_CN";
import { Provider } from "react-redux";
import $ from "jquery";
import moment from "moment";
import "moment/locale/zh-cn";
import { Chat } from "./util/chat";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
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
        <PersistGate loading={null} persistor={persistor}>
          <IndexRouter />
        </PersistGate>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
