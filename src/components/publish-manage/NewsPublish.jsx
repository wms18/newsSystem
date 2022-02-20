/*
 * @Descripttion:
 * @version: X3版本
 * @Author: 吴毛三
 * @Date: 2022-01-28 23:20:45
 * @LastEditors: 吴毛三
 * @LastEditTime: 2022-02-20 23:07:34
 */
import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Modal, Popover, Switch } from "antd";
import { NavLink } from "react-router-dom";
const NewsPublish = (props) => {
  const { type } = props;
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
      dataIndex: props.data.category ? "category" : "categoryId",
      render: (key, item) => {
        return <Tag color={"orange"}>{item.categories[key - 1]?.value}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_, item) => <div>{props.button(item.id)}</div>,
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        pagination={{ pageSize: 5 }}
        dataSource={props.data}
        rowKey={(item) => item.id}
      />
    </div>
  );
};

export default NewsPublish;
