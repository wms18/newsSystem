import React, { useEffect, useState } from "react";
import { Calendar, message } from "antd";
import axios from "axios";
const Audit = () => {
  const [dateInfo, setDateInfo] = useState([]);
  const [modalType, setModalType] = useState('');
  useEffect(() => {
    axios.get("/time").then((res) => {
      setDateInfo(res.data);
    });
  }, []);
  const onPanelChange = (value, mode) => {
    console.log(value, mode);
    setModalType(mode);
  };
  const dateCellRender = (value) => {
    dateInfo.map((item) => {
      //   console.log(item.day,value.date());
      if (item.day === value.date()) {
        console.log(item.day);
        let el = document.getElementsByClassName(
          "ant-picker-calendar-date-value"
        );
        if (el.length > 0) {
          el[item.day].style.color = "red";
        }
      }
    });
  };
  const onSelect = (value) => {
    console.log(value);
    if (modalType !== "year") {
      message.success("成功");
    }
  };
  return (
    <div>
      <div className="site-calendar-customize-header-wrapper">
        <Calendar
          onPanelChange={onPanelChange}
          dateCellRender={dateCellRender}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
};

export default Audit;
