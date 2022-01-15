import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Modal, Popover, Switch } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
const RightList = () => {
  const { confirm } = Modal;
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "权限名称",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      key: "key",
      render: (key) => {
        return <Tag color={"orange"}>{key}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (item) => (
        <div>
          <Button danger shape="circle" style={{ marginRight: "10px" }}>
            <DeleteOutlined onClick={() => showConfirm(item)} />
          </Button>
          <Popover
            content={
              <div style={{ textAlign: "center" }}>
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  defaultChecked
                  checked={item.pagepermisson === 1}
                  onChange={() => handleSwitch(item)}
                />
              </div>
            }
            title="页面配置项"
            trigger={item.pagepermisson === undefined ? "" : "click"}
          >
            <Button
              type="primary"
              shape="circle"
              disabled={item.pagepermisson === undefined ? true : false}
            >
              <EditOutlined />
            </Button>
          </Popover>
        </div>
      ),
    },
  ];
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      let list = res.data;
      list.forEach((item) => {
        if (item.children.length === 0) {
          item.children = "";
        }
      });
      setData(list);
    });
  }, []);
  const handleSwitch = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;

    setData([...data]);
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    }
  };
  //删除提示
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
    if (item.grade === 1) {
      data = data.filter((data) => data.id !== item.id);
      setData(data);
      axios.delete(`/rights/${item.id}`);
    } else {
      let list = data.filter((data) => data.id === item.rightId);
      list[0].children = list[0].children.filter((data) => data.id !== item.id);
      setData([...data]);
      axios.delete(`/children/${item.id}`);
    }
  };
  return (
    <div>
      <Table columns={columns} pagination={{ pageSize: 5 }} dataSource={data} />
    </div>
  );
};

export default RightList;
