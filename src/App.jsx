import IndexRouter from "./router/IndexRouter";
import { ConfigProvider } from "antd";
import zh_CN from "antd/es/locale/zh_CN";
import $ from "jquery";
import moment from "moment";
import "moment/locale/zh-cn";
import { Chat } from "./util/chat";
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
      <IndexRouter />
    </ConfigProvider>
  );
}

export default App;
