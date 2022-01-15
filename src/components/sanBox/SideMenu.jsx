import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Layout, Menu } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import "./index.css";
const { Sider } = Layout;
const { SubMenu } = Menu;
const menuList = [
  {
    key: "/home",
    icon: <UploadOutlined />,
    title: "首页",
  },
  {
    key: "/user-manage/list",
    icon: <UploadOutlined />,
    title: "用户管理",
  },
  {
    key: "/right-manage",
    icon: <UploadOutlined />,
    title: "权限管理",
    child: [
      {
        key: "/right-manage/role/list",
        icon: <UploadOutlined />,
        title: "角色列表",
      },
      {
        key: "/right-manage/right/list",
        icon: <UploadOutlined />,
        title: "权限列表",
      },
    ],
  },
];
//映射图标
const iconList = {
  "/home": <UserOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <UserOutlined />,
};
const SideMenu = (props) => {
  const [menu, setMenu] = useState([]);
  const defaultSelectedKeys = [props.location.pathname];
  const selectedKeys = ["/" + props.location.pathname.split("/")[1]];
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    axios
      .get("/rights?_embed=children")
      .then((res) => {
        setMenu(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const checkPagepermisson = (item) => {
    return item.pagepermisson === 1 && rights.includes(item.key);
  };
  const renderList = (menu) => {
    return menu.map((item) => {
      if (item.children?.length > 0 && checkPagepermisson(item)) {
        return (
          <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
            {renderList(item.children)}
          </SubMenu>
        );
      }
      return (
        checkPagepermisson(item) && (
          <Menu.Item
            key={item.key}
            icon={iconList[item.key]}
            onClick={() => props.history.push(item.key)}
          >
            {item.title}
          </Menu.Item>
        )
      );
    });
  };

  return (
    <Sider trigger={null} collapsible>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="logo">全球新闻发布管理系统</div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            theme="dark"
            mode="inline"
            defaultOpenKeys={selectedKeys}
            selectedKeys={defaultSelectedKeys}
          >
            {renderList(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  );
};

export default withRouter(SideMenu);
