/*
 * @Descripttion:
 * @version: X3版本
 * @Author: 吴毛三
 * @Date: 2021-12-25 01:19:07
 * @LastEditors: 吴毛三
 * @LastEditTime: 2022-02-13 23:14:18
 */
import React from "react";
import { Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
const { Header } = Layout;
const TopHeader = (props) => {
  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem("token"));
  const menu = (
    <Menu>
      <Menu.Item key={"1"}>{roleName}</Menu.Item>
      <Menu.Item
        key={"2"}
        danger
        onClick={() => {
          localStorage.removeItem("token");
          props.history.replace("/login");
        }}
      >
        退出
      </Menu.Item>
    </Menu>
  );
  // console.log(props);
  const changeCollapsed = () => {
    props.changeCollapsed();
  };
  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {props.isCollApsed ? (
        <MenuUnfoldOutlined onClick={changeCollapsed}></MenuUnfoldOutlined>
      ) : (
        <MenuFoldOutlined onClick={changeCollapsed}></MenuFoldOutlined>
      )}
      <div style={{ float: "right" }}>
        <span>
          欢迎 <span style={{ color: "#1890ff" }}>{username}</span>回来
        </span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
};
/* 
  connect (
    mapStateProps,
    mapDispatchToProps
  )(被包装的组件)
 */
const mapStateProps = ({ CollApsedReducer: { isCollApsed } }) => {
  return { isCollApsed };
};
const mapDispatchToProps = {
  changeCollapsed() {
    return { type: "change_collapsed" };
  },
};
export default connect(
  mapStateProps,
  mapDispatchToProps
)(withRouter(TopHeader));
