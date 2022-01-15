import React, { useEffect, useState } from "react";
import { Calendar, Badge, Modal } from "antd";
import moment from "moment";
import axios from "axios";
let timer;
const NoPermission = () => {
  const [visible, setVisible] = useState(false);
  const [curDate, setCurDate] = useState(0);
  useEffect(() => {
    let date = new Date();
    console.log(date.toLocaleDateString());
    setCurDate(date.toLocaleDateString());
    renderTimer();
    return () => {
      clearInterval(timer);
    };
  }, []);
  const renderTimer = () => {
    axios.get( "/time").then((res) => {
      console.log(res.data);
      let num = res.data;
      if (num.length === 0) {
        return;
      }
      timer = setInterval(() => {
        console.log(num[0]);
        num[0] = num[0] - 1000;
        if (num[0] <= 0) {
          setVisible(true);
          clearInterval(timer);
          renderTimer();
        }
      }, 1000);
    });
  };

  function getListData(value) {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          { type: "warning", content: "This is warning event." },
          { type: "success", content: "This is usual event." },
        ];
        break;
      case 10:
        listData = [
          { type: "warning", content: "This is warning event." },
          { type: "success", content: "This is usual event." },
          { type: "error", content: "This is error event." },
        ];
        break;
      case 15:
        listData = [
          { type: "warning", content: "This is warning event" },
          { type: "success", content: "This is very long usual event。。...." },
          { type: "error", content: "This is error event 1." },
          { type: "error", content: "This is error event 2." },
          { type: "error", content: "This is error event 3." },
          { type: "error", content: "This is error event 4." },
        ];
        break;
      default:
    }
    return listData || [];
  }

  function dateCellRender(value) {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  }

  function getMonthData(value) {
    if (value.month() === 8) {
      return 1394;
    }
  }

  function monthCellRender(value) {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  }

  const handleOk = (e) => {
    setVisible(false);
  };

  const handleCancel = (e) => {
    setVisible(false);
  };
  return (
    <div>
      <Calendar
        // value={curDate}
        onSelect={() => setVisible(true)}
        dateCellRender={dateCellRender}
        monthCellRender={monthCellRender}
      />
      <Modal
        title="Basic Modal"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
};

export default NoPermission;
