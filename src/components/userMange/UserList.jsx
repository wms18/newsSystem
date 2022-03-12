import React, { forwardRef, useState, useEffect } from "react";
import { Select, Form, Input, Row, Col } from "antd";
const UserForm = (props, ref) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { regionList, roleList, userInfo, formDisabled, modalBoth } = props;
  const [isDisabled, setIsDisabled] = useState(false);
  useEffect(() => {
    if (userInfo.roleId !== 1) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [formDisabled]);
  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );
  const roleObj = {
    1: "superAdmin",
    2: "admin",
    3: "editor",
  };
  const checkRegion = (item) => {
    if (modalBoth === "更新") {
      if (roleObj[roleId] === "superAdmin") {
        return false;
      } else {
        return true;
      }
    } else {
      if (roleObj[roleId] === "superAdmin") {
        return false;
      } else {
        return item.value !== region;
      }
    }
  };
  const checkRole = (item) => {
    if (modalBoth === "更新") {
      if (roleObj[roleId] === "superAdmin") {
        return false;
      } else {
        return true;
      }
    } else {
      if (roleObj[roleId] === "superAdmin") {
        return false;
      } else {
        return roleObj[item.id] !== "editor";
      }
    }
  };
  const renderRegionList = () => {
    return regionList.map((item) => {
      return (
        <Option disabled={checkRegion(item)} key={item.id} value={item.value}>
          {item.title}
        </Option>
      );
    });
  };
  const renderRoleList = () => {
    return roleList.map((item) => {
      return (
        <Option disabled={checkRole(item)} key={item.id} value={item.id}>
          {item.roleName}
        </Option>
      );
    });
  };
  //   form.setFieldsValue(userInfo);
  return (
    <Form
      form={form}
      layout="horizontal"
      // labelCol={{
      //   span: 4,
      // }}
      // wrapperCol={{
      //   span: 20,
      // }}
      ref={ref}
    >
      <Row>
        <Col span={12}>
          <Form.Item
            name="username"
            hasFeedback
            label="用户名"
            rules={[
              {
                required: true,
                message: "请输入用户名",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={11} offset={1}>
          <Form.Item
            name="password"
            hasFeedback
            label="密码"
            rules={[
              {
                required: true,
                message: "请输入密码",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12 }>
          <Form.Item
          wrapperCol={{offset:1 }}
            name="region"
            label="区域"
            rules={
              isDisabled
                ? []
                : [
                    {
                      required: true,
                      message: "请选择",
                    },
                  ]
            }
          >
            <Select placeholder="请选择" disabled={isDisabled}>
              {renderRegionList()}
            </Select>
          </Form.Item>
        </Col>
        <Col span={11} offset={1}>
          <Form.Item
            name="roleId"
            label="角色"
            hasFeedback
            rules={[
              {
                required: true,
                message: "请选择",
              },
            ]}
          >
            <Select
              onChange={(item) => {
                if (item === 1) {
                  ref.current.setFieldsValue({ region: "" });
                  setIsDisabled(true);
                } else {
                  setIsDisabled(false);
                }
              }}
              placeholder="请选择"
            >
              {renderRoleList()}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default forwardRef(UserForm);
