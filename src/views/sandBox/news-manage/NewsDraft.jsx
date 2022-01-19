import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Table, Button, Modal, message, notification } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
const NewsDraft = (props) => {
  const [data, setData] = useState([]);
  const { confirm } = Modal;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [current, setCurrent] = useState("");
  const [category, setCategory] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <b>{id}</b>,
    },
    {
      title: "新闻标题",
      dataIndex: "title",
      key: "title",
      render: (title, item) => {
        return (
          <NavLink to={`/news-manage/preview/${item.id}`}>{title}</NavLink>
        );
      },
    },
    {
      title: "新闻标题",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      key: "category",
      render: (item) => {
        return <span>{category[item - 1].value}</span>;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (item) => (
        <div>
          <Button danger shape="circle">
            <DeleteOutlined onClick={() => showConfirm(item)} />
          </Button>
          <Button
            shape="circle"
            icon={<EditOutlined></EditOutlined>}
            style={{ margin: "0 10px" }}
            onClick={() => {
              props.history.push(`/news-manage/update/${item.id}`);
            }}
          ></Button>
          <Button
            type="primary"
            shape="circle"
            onClick={() => handleCheck(item.id)}
          >
            <UploadOutlined />
          </Button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    axios.get("/categories").then((res) => {
      setCategory(res.data);
    });
    axios.get(`/news?author=${username}&auditState=0`).then((res) => {
      setData(res.data);
    });
  }, [username]);
  const handleCheck = (id) => {
    axios
      .patch(`/news/${id}`, {
        auditState: 1,
      })
      .then((res) => {
        // console.log(res);
        props.history.push("/audit-manage/list");
        notification.info({
          message: "通知",
          description: `您可以到审核列表中查看您的新闻`,
          placement: "topRight",
        });
      });
  };
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
    let newData = data.filter((data) => data.id !== item.id);
    setData(newData);
    axios.delete(`/news/${item.id}`);
    message.success("删除成功");
  };
  const handleOk = () => {
    setIsModalVisible(false);
    setData();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Table rowKey={(item) => item.id} dataSource={data} columns={columns} />
      <Modal
        title="权限分配"
        cancelText={"取消"}
        okText="确定"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      ></Modal>
    </div>
  );
};

export default NewsDraft;
