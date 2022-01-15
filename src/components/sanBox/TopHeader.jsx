import React from "react";
import { Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import { useState } from "react";
const { Header } = Layout;
const TopHeader = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };
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
  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: "trigger",
        onClick: toggle,
      })}
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

export default withRouter(TopHeader);
