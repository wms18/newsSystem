import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Tree } from "antd";
import {
  DeleteOutlined,
  UnorderedListOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
const RoleList = () => {
  const [data, setData] = useState([]);
  const { confirm } = Modal;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rightList, setRightList] = useState([]);
  const [current, setCurrent] = useState("");
  const [currentId, setCurrentId] = useState(0);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "操作",
      key: "action",
      render: (item) => (
        <div>
          <Button danger shape="circle" style={{ marginRight: "10px" }}>
            <DeleteOutlined onClick={() => showConfirm(item)} />
          </Button>
          <Button type="primary" shape="circle">
            <UnorderedListOutlined
              onClick={() => {
                setIsModalVisible(true);
                setCurrent(item.rights);
                setCurrentId(item.id);
              }}
            />
          </Button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    axios.get(`/roles`).then((res) => {
      setData(res.data);
    });
  }, []);
  useEffect(async () => {
    const res = await axios("/rights?_embed=children");
    setRightList(res.data);
  }, []);
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
    data = data.filter((data) => data.id !== item.id);
    setData(data);
    axios.delete(`/roles/${item.id}`);
  };
  const handleOk = () => {
    setIsModalVisible(false);
    setData(
      data.map((item) => {
        if (item.id === currentId) {
          return { ...item, rights: current };
        }
        return item;
      })
    );
    axios.patch(`/roles/${currentId}`, { rights: current });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onCheck = (checkedKeys) => {
    setCurrent(checkedKeys.checked);
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
      >
        <Tree
          checkable
          treeData={rightList}
          onCheck={onCheck}
          checkStrictly
          checkedKeys={current}
        />
      </Modal>
    </div>
  );
};

export default RoleList;
