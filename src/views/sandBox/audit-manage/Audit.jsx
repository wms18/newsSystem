import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Tag, notification } from "antd";
import { NavLink } from "react-router-dom";
const { roleId, region, username } = JSON.parse(localStorage.getItem("token"));
const Audit = () => {
  const roleObj = {
    1: "superAdmin",
    2: "admin",
    3: "editor",
  };
  const [data, setData] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    renderData();
  }, []);
  useEffect(() => {
    axios.get(`/regions`).then((res) => {
      setRegionList(res.data);
    });
    axios.get("/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);
  const columns = [
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
      title: "作者",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      key: "category",
      render: (item) => {
        return (
          <Tag color={"orange"}>
            {categories.length > 0 && categories[item - 1].value}
          </Tag>
        );
      },
    },
    {
      title: "审核状态",
      dataIndex: "auditState",
      key: "auditState",
      render: (key, item) => {
        const colorList = ["", "orange", "green", "red"];
        const auditStateList = ["草稿箱", "审核中", "已通过", "未通过"];
        return <Tag color={colorList[key]}>{auditStateList[key]}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (item) => {
        return (
          <div>
            <Button type="primary" style={{marginRight:'20px'}} onClick={() => handleAudit(item, 2, 1)}>
              通过
            </Button>
            <Button danger onClick={() => handleAudit(item, 3, 0)}>
              驳回
            </Button>
          </div>
        );
      },
    },
  ];
  const handleAudit = (item, auditState, publishState) => {
    setData(data.filter((value) => value.id !== item.id));
    axios
      .patch(`/news/${item.id}`, {
        auditState,
        publishState,
      })
      .then((res) => {
        notification.info({
          message: "通知",
          description: `您可以到[审核管理/审核列表]中查看您的新闻的审核状态`,
          placement: "topRight",
        });
      });
  };
  const renderData = async () => {
    axios.get(`/news?auditState=1`).then((res) => {
      const list = res.data;
      setData(
        roleObj[roleId] === "superAdmin"
          ? list
          : [
              ...list.filter((item) => item.author === username),
              ...list.filter(
                (item) => item.region === region && roleObj[roleId] === "editor"
              ),
            ]
      );
    });
  };

  return (
    <div>
      <Table
        rowKey={(item) => item.id}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        columns={columns}
      />
    </div>
  );
};

export default Audit;
