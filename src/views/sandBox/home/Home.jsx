/*
 * @Descripttion:
 * @version: X3版本
 * @Author: 吴毛三
 * @Date: 2021-12-25 01:29:58
 * @LastEditors: 吴毛三
 * @LastEditTime: 2022-02-16 22:54:48
 */
import React from "react";
import { Card, Col, Row, List, Avatar } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
const { Meta } = Card;

const Home = (props) => {
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              dataSource={["eruoiw", "3479283479"]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              dataSource={["eruoiw", "3479283479"]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title="Card title"
              description="This is the description"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
