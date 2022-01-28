// import React, { useEffect, useState } from "react";
// import { Calendar, Badge, Modal } from "antd";
// import moment from "moment";
// import axios from "axios";
// import "./index.module.css";
// let timer;
// const NoPermission = () => {
//   const [visible, setVisible] = useState(false);
//   const [curDate, setCurDate] = useState(0);
//   useEffect(() => {
//     let date = new Date();
//     // console.log(date.toLocaleDateString());
//     setCurDate(date.toLocaleDateString());
//     renderTimer();
//     console.log(document.getElementsByClassName("ant-picker-content"));
//     return () => {
//       clearInterval(timer);
//     };
//   }, []);
//   const renderTimer = () => {
//     axios.get("/time").then((res) => {
//       // console.log(res.data);
//       let num = res.data;
//       if (num.length === 0) {
//         return;
//       }
//       timer = setInterval(() => {
//         console.log(num[0]);
//         num[0] = num[0] - 1000;
//         if (num[0] <= 0) {
//           setVisible(true);
//           clearInterval(timer);
//           renderTimer();
//         }
//       }, 1000);
//     });
//   };
//   // function getListData(value) {
//   //   let listData;
//   //   switch (value.date()) {
//   //     case 8:
//   //       listData = [
//   //         { type: "warning", content: "This is warning event." },
//   //         { type: "success", content: "This is usual event." },
//   //       ];
//   //       break;
//   //     case 10:
//   //       listData = [
//   //         { type: "warning", content: "This is warning event." },
//   //         { type: "success", content: "This is usual event." },
//   //         { type: "error", content: "This is error event." },
//   //       ];
//   //       break;
//   //     case 15:
//   //       listData = [
//   //         { type: "warning", content: "This is warning event" },
//   //         { type: "success", content: "This is very long usual event。。...." },
//   //         { type: "error", content: "This is error event 1." },
//   //         { type: "error", content: "This is error event 2." },
//   //         { type: "error", content: "This is error event 3." },
//   //         { type: "error", content: "This is error event 4." },
//   //       ];
//   //       break;
//   //     default:
//   //   }
//   //   return listData || [];
//   // }
//   // function dateCellRender(value) {
//   //   const listData = getListData(value);
//   //   return (
//   //     <ul className="events">
//   //       {listData.map((item) => (
//   //         <li key={item.content}>
//   //           <Badge status={item.type} text={item.content} />
//   //         </li>
//   //       ))}
//   //     </ul>
//   //   );
//   // }
//   // function getMonthData(value) {
//   //   if (value.month() === 8) {
//   //     return 1394;
//   //   }
//   // }
//   // function monthCellRender(value) {
//   //   const num = getMonthData(value);
//   //   return num ? (
//   //     <div className="notes-month">
//   //       <section>{num}</section>
//   //       <span>Backlog number</span>
//   //     </div>
//   //   ) : null;
//   // }
//   const handleOk = (e) => {
//     setVisible(false);
//   };
//   const handleCancel = (e) => {
//     setVisible(false);
//   };
//   return (
//     <div>
//       <div className="active">
//         <div className="notice-con">
//           <span
//             className="notice"
//             style={{
//               animation: `move ${8}s infinite linear`,
//             }}
//           >
//             <span>好不错</span>
//             已占据第一名3天0时29分钟，不服来战！11111111111111111111111111111111111111111111111111111111111111111111
//           </span>
//         </div>
//         {/* <Calendar
//           // value={curDate}
//           onSelect={() => setVisible(true)}
//           dateCellRender={dateCellRender}
//           monthCellRender={monthCellRender}
//         /> */}
//       </div>

//       <Modal
//         title="Basic Modal"
//         visible={visible}
//         onOk={handleOk}
//         onCancel={handleCancel}
//       >
//         <p>Some contents...</p>
//         <p>Some contents...</p>
//         <p>Some contents...</p>
//       </Modal>
//     </div>
//   );
// };

// export default NoPermission;
//41个字内不用加，每次多1个字190行加14
import React from "react";
import { SoundOutlined } from "@ant-design/icons";
import "./index.module.css";
export default class NoPermission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          key: 1,
          title: "这个是我的广告消息二",
        },
        // {
        //   key: 2,
        //   title: "这个是我的广告消息二这个是我的广告消息一",
        // },
        // {
        //   key: 3,
        //   title: "这个是我的广告消息三这个是我的广告消息一",
        // },
        // {
        //   key: 4,
        //   title: "这个是我的广告消息四这个是我的广告消息一",
        // },
        // {
        //   key: 5,
        //   title: "这个是我的广告消息五这个是我的广告消息一",
        // },
        // {
        //   key: 6,
        //   title: "这个是我的广告消息六这个是我的广告消息一",
        // },
        // {
        //   key: 7,
        //   title: "这个是我的广告消息七这个是我的广告消息一",
        // },
      ],
    };
    this.ulValue = React.createRef(null);
    this.left = React.createRef(null);
  }

  componentDidMount() {
    if (this.ulValue.current) {
      window.cancelAnimationFrame(this.myanimation);
      console.log(
        window.getComputedStyle(this.left.current).width.replace("px", "")*1 +
          2 +
          "px"
      );
      this.ulValue.current.style.width =
        window.getComputedStyle(this.left.current).width.replace("px", "") * 1 +
        "px";
      this.myanimation = window.requestAnimationFrame(this.animationAdvertise);
    }
  }
  componentDidUpdate() {
    window.cancelAnimationFrame(this.myanimation);
    console.log(
      parseInt(
        window.getComputedStyle(this.left.current).width.replace("px", "")
      ) + "px"
    );
    this.ulValue.current.style.width =
      window.getComputedStyle(this.left.current).width.replace("px", "")*1+140 + "px";
    this.myanimation = window.requestAnimationFrame(this.animationAdvertise);
  }

  animationAdvertise = (timetap) => {
    // console.log(timetap,'2134123131');
    if (this.left.current) {
      if (!this.time) this.time = timetap;
      const progress = timetap - this.time;
      const long = parseInt(
        window.getComputedStyle(this.left.current).width.replace("px", "")
      );
      const width = -Math.max(progress / 10, 0);
      // console.log(long);
      if (!this.stopWidth) {
        this.stopWidth = 0;
      }
      // console.log(this.stopWidth + width, long);
      console.log(long);
      this.ulValue.current.style.marginLeft =
        this.stopWidth + width + 600 + "px";
      if (-(this.stopWidth + width) >= long + 600) {
        // console.log(this.stopWidth + width);
        this.ulValue.current.style.marginLeft = 600;
        this.ulValuewidth = 0;
        this.time = timetap;
        this.stopWidth = 0;
      } else {
        // console.log(this.stopWidth + width)
        this.ulValuewidth = this.stopWidth + width + 0;
      }

      this.myanimation = window.requestAnimationFrame(this.animationAdvertise);
    }
  };

  onMouseEnter = () => {
    this.time = null;
    window.cancelAnimationFrame(this.myanimation);
  };

  onMouseLeave = () => {
    this.time = null;
    this.stopWidth = this.ulValuewidth;
    window.cancelAnimationFrame(this.myanimation);
    this.myanimation = window.requestAnimationFrame(this.animationAdvertise);
  };

  render() {
    return (
      <div
        style={{
          width: "600px",
          margin: "50px auto",
          height: "40px",
          display: "flex",
          backgroundColor: "#ccc",
          alignItems: "center",
        }}
      >
        <span>
          <SoundOutlined />
        </span>
        <div
          style={{
            overflow: "hidden",
            color: "#fff",
          }}
        >
          <div
            className="ul"
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            ref={this.ulValue}
          >
            <div className="li" ref={this.left}>
              {this.state.list.map((item) => {
                return <span key={item.key}>{item.title}</span>;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
