import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { PageHeader, Descriptions } from "antd";
const Preview = (props) => {
  const auditStateList = ["未审核", "审核中", "已通过", "未通过"];
  const publishStateList = ["未发布", "发布中", "已上线", "已下线"];
  const id = props.match.params.id;
  const [newsInfo, setNewsInfo] = useState();
  useEffect(() => {
    Promise.all([
      axios.get(`/news/${id}?_expand=role`),
      axios.get("/categories"),
    ]).then((res) => {
      setNewsInfo({ ...res[0].data, categories: res[1].data });
    });
  }, [id]);
  return (
    <>
      {newsInfo && (
        <div>
          <PageHeader
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={newsInfo.categories.map((item) => {
              if (item.id === newsInfo.category) {
                return item.value;
              }
            })}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">
                {newsInfo.author}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {moment(newsInfo.createTime).format("YYYY-MM-DD HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="发布时间">
                {newsInfo.publishTime
                  ? moment(newsInfo.publishTime).format("YYYY-MM-DD HH:mm:ss")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="区域">
                {newsInfo.region}
              </Descriptions.Item>
              <Descriptions.Item label="审核状态">
                <span style={{ color: "red" }}>
                  {auditStateList[newsInfo.auditState]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="发布状态">
                <span style={{ color: "red" }}>
                  {publishStateList[newsInfo.publishState]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="访问数量">
                {newsInfo.view}
              </Descriptions.Item>
              <Descriptions.Item label="点赞数量">
                {newsInfo.star}
              </Descriptions.Item>
              <Descriptions.Item label="评论数量">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <div
            style={{
              border: "1px solid gray",
              margin: "0 24px",
              padding: "10px",
              wordBreak: "break-all",
              whiteSpace: "pre-wrap",
            }}
          >
            {newsInfo.content}
          </div>
        </div>
      )}
    </>
  );
};

export default Preview;
