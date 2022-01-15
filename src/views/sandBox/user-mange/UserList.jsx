import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Modal, Switch, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import UserForm from "../../../components/userMange/UserList";
const UserList = () => {
  const [data, setData] = useState([]);
  const { confirm } = Modal;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [modalBoth, setModalBoth] = useState();
  const [userInfo, setUserInfo] = useState();
  const [formDisabled, setFormDisabled] = useState(false);
  const addForm = useRef(null);
  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );
  const roleObj = {
    1: "superAdmin",
    2: "admin",
    3: "editor",
  };
  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      key: "region",
      filters: [
        ...regionList.map((item) => ({
          text: item.title,
          value: item.value,
        })),
        { text: "全球", value: "" },
      ],
      onFilter: (value, item) => item.region === value,
      render: (region) => {
        return <b>{region ? region : "全球"}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        return role?.roleName;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "用户状态",
      dataIndex: "roleState",
      key: "roleState",
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => handleState(item)}
          ></Switch>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      render: (item) => (
        <div>
          <Button
            danger
            shape="circle"
            style={{ marginRight: "10px" }}
            disabled={item.default}
            icon={<DeleteOutlined />}
            onClick={() => showConfirm(item)}
          />
          <Button
            type="primary"
            shape="circle"
            disabled={item.default}
            onClick={() => handleUpdate(item)}
          >
            <EditOutlined />
          </Button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    renderData();
  }, []);
  const renderData = async () => {
    await axios.get(`/users?_expand=role`).then((res) => {
      const list = res.data;
      setData(
        roleObj[roleId] === "superAdmin"
          ? list
          : [
              ...list.filter((item) => item.username === username),
              ...list.filter(
                (item) => item.region === region && roleObj[roleId] === "editor"
              ),
            ]
      );
    });
  };
  useEffect(() => {
    axios.get(`/regions`).then((res) => {
      setRegionList(res.data);
    });
  }, []);
  useEffect(() => {
    axios.get(`/roles`).then((res) => {
      setRoleList(res.data);
    });
  }, []);
  const handleState = (item) => {
    item.roleState = !item.roleState;
    setData([...data]);
    axios.patch(`/users/${item.roleId}`, {
      roleState: item.roleState,
    });
  };
  //更新
  const handleUpdate = async (item) => {
    // console.log(item);
    setModalBoth("更新");
    setUserInfo(item);
    await setIsModalVisible(true);
    if (item.roleId === 1) {
      setFormDisabled(true);
    } else {
      setFormDisabled(false);
    }
    addForm.current.setFieldsValue(item);
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
    setData(data.filter((data) => data.id !== item.id));
    axios
      .delete(`/users/${item.id}`)
      .then((res) => {
        message.success("删除成功");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const showModal = () => {
    setIsModalVisible(true);
    setModalBoth("添加");
  };
  const addFormOk = () => {
    // console.log(modalBoth);
    if (modalBoth === "添加") {
      addForm.current
        .validateFields()
        .then((value) => {
          setIsModalVisible(false);
          addForm.current.resetFields();
          axios
            .post(`/users`, {
              ...value,
              roleState: true,
              default: false,
            })
            .then((res) => {
              setData([...data, res.data]);
              renderData();
              message.success("添加成功");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err.values);
        });
    } else {
      addForm.current
        .validateFields()
        .then((res) => {
          console.log(res);
          setIsModalVisible(false);
          setData(
            data.map((dataIndex) => {
              if (dataIndex.id === userInfo.id) {
                return {
                  ...dataIndex,
                  ...res,
                  role: roleList.filter((item) => item.id === res.roleId)[0],
                };
              }
              return dataIndex;
            })
          );
          axios.patch(`/users/${userInfo.id}`, res).then((res) => {
            message.success("更新成功");
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div>
      <Button type="primary" onClick={showModal}>
        添加用户
      </Button>
      <Table
        rowKey={(item) => item.id}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        columns={columns}
      />
      <Modal
        visible={isModalVisible}
        title={modalBoth + "用户信息"}
        okText={modalBoth === "添加" ? "确定" : "更新"}
        cancelText="取消"
        destroyOnClose={modalBoth === "添加" ? true : false}
        onCancel={() => {
          setIsModalVisible(false);
          addForm.current.resetFields();
          setFormDisabled(!formDisabled);
        }}
        onOk={() => {
          addFormOk();
        }}
      >
        <UserForm
          ref={addForm}
          roleList={roleList}
          regionList={regionList}
          userInfo={modalBoth === "更新" ? userInfo : ""}
          formDisabled={formDisabled}
          modalBoth={modalBoth}
        ></UserForm>
      </Modal>
    </div>
  );
};

export default UserList;
