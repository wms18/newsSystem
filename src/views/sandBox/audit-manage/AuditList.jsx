import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Table, Button, Tag, notification } from "antd";
const AuditList = (props) => {
  const { username } = JSON.parse(localStorage.getItem("token"));
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios
      .get(`/news?author=${username}&auditState_ne=0&publishState_lte=1`)
      .then((res) => {
        setData(res.data);
      });
    axios.get("/categories").then((res) => {
      setCategories(res.data);
    });
  }, [username]);
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
            {item.auditState === 1 && (
              <Button onClick={() => handleRevoke(item)}>撤销</Button>
            )}
            {item.auditState === 2 && (
              <Button danger onClick={() => handlePublish(item)}>
                发布
              </Button>
            )}
            {item.auditState === 3 && (
              <Button type="primary" onClick={() => handleUpdate(item)}>
                更新
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  //撤销
  const handleRevoke = (item) => {
    let newData = data.filter((value) => value.id !== item.id);
    setData(newData);
    axios.patch(`/news/${item.id}`).then((res) => {
      notification.info({
        message: "通知",
        description: `您可以到草稿箱中查看您的新闻`,
        placement: "topRight",
      });
    });
  };
  /**
   * @name: 吴毛三
   * @test: test font
   * @msg: 更新
   * @param {*}
   * @return {*}
   */
  const handleUpdate = (item) => {
    props.history.push(`/news-manage/update/${item.id}`);
  };
  /**
   * @name: 吴毛三
   * @test: test font
   * @msg: 发布
   * @param {*}
   * @return {*}
   */
  const handlePublish = (item) => {
    axios
      .patch(`/news/${item.id}`, {
        'publishState': 2,
      })
      .then((res) => {
        // console.log(res);
        props.history.push("/publish-manage/published");
        notification.info({
          message: "通知",
          description: `您可以到【发布管理/已经发布】中查看您的新闻`,
          placement: "topRight",
        });
      });
  };
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
