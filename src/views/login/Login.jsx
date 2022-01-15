import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import ParticlesBg from "particles-bg";
import axios from "axios";
import "./login.css";
import icon from "./logo192.png";
let config = {
  num: [4, 7],
  rps: 0.1,
  radius: [5, 40],
  life: [1.5, 3],
  v: [2, 3],
  tha: [-50, 50],
  alpha: [0.6, 0],
  scale: [0.1, 0.9],
  body: icon,
  position: "all",
  // color: ["random", "#ff0000"],
  cross: "dead",
  random: 10,
};
const Login = (props) => {
  const onFinish = (values) => {
    axios
      .get(
          `/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`
      )
      .then((res) => {
        if (res.data.length === 0) {
          message.error("登录失败");
        } else {
          message.success("登录成功");
          localStorage.setItem("token", JSON.stringify(res.data[0]));
          props.history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div style={{ backgroundColor: "rgba(35,39,65,1)", height: "100%" }}>
      <ParticlesBg type="custom" config={config} bg={true} />
      <div className="contain">
        <div className="loginTitle">全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "请输入用户名",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="请输入用户名"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "请输入密码",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="请输入密码"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
