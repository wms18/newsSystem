import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Table, Button, Tag, Modal, Popover, Switch } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
const AuditList = () => {
  const { username } = JSON.parse(localStorage.getItem("token"));
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([])
  useEffect(() => {
    axios
      .get(`/news?author=${username}&auditState_ne=0&publishState_lte=1`)
      .then((res) => {
      console.log(res.data);
        setData(res.data);
      });
    axios.get("/categories").then((res) => {
      console.log(res.data);
      setCategories(res.data)
    });
  }, [username]);
  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      key: "title",
      render: (title, item) => {
        return <NavLink to={`news-manage/preview/${item.id}`}>{title}</NavLink>;
      },
    },
    {
      title: "作者",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      key: "category",
      render: (item) => {
        return <Tag color={"orange"}>{categories[item-1].value}</Tag>;
      },
    },
    {
      title: "审核状态",
      dataIndex: "auditState",
      key: "auditState",
      render: (key) => {
        return <Tag color={"orange"}>{key}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (item) => (
        <div>
          <Button danger shape="circle" style={{ marginRight: "10px" }}>
            <DeleteOutlined />
          </Button>
          <Popover
            content={
              <div style={{ textAlign: "center" }}>
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  defaultChecked
                  checked={item.pagepermisson === 1}
                />
              </div>
            }
            title="页面配置项"
            trigger={item.pagepermisson === undefined ? "" : "click"}
          >
            <Button
              type="primary"
              shape="circle"
              disabled={item.pagepermisson === undefined ? true : false}
            >
              <EditOutlined />
            </Button>
          </Popover>
        </div>
      ),
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        rowKey={(item) => item.id}
        pagination={{ pageSize: 5 }}
        dataSource={data}
      />
    </div>
  );
};

export default AuditList;
