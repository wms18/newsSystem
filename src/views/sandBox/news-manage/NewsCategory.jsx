/*
 * @Descripttion:
 * @version: X3版本
 * @Author: 吴毛三
 * @Date: 2022-01-07 23:29:55
 * @LastEditors: 吴毛三
 * @LastEditTime: 2022-01-28 23:13:46
 */
import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Modal, Popover, Switch } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
const NewsCategory = () => {
  const { confirm } = Modal;
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "栏目名称",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "操作",
      key: "action",
      render: (item) => (
        <div>
          <Button danger shape="circle" style={{ marginRight: "10px" }}>
            <DeleteOutlined onClick={() => showConfirm(item)} />
          </Button>
        </div>
      ),
    },
  ];
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("/categories").then((res) => {
      let list = res.data;
      setData(list);
    });
  }, []);
  //删除提示
  const showConfirm = (item) => {
    confirm({
      title: "确定删除吗?",
      cancelText: "取消",
      okText: "确定",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDelete(item);
      },
      onCancel() {
        // console.log("Cancel");
      },
    });
  };
  const handleDelete = (item) => {
    data = data.filter((data) => data.id !== item.id);
    setData(data);
    axios.delete(`/categories/${item.id}`);
  };
  return (
    <div>
      <Table columns={columns} pagination={{ pageSize: 5 }} rowKey={(item)=>item.id} dataSource={data} />
    </div>
  );
};

export default NewsCategory;
