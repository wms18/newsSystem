/*
 * @Descripttion:
 * @version: X3版本
 * @Author: 吴毛三
 * @Date: 2022-01-29 23:45:32
 * @LastEditors: 吴毛三
 * @LastEditTime: 2022-01-30 01:51:07
 */
import { useEffect, useState } from "react";
import { notification } from "antd";
import axios from "axios";
function usePublish(type) {
  const { username } = JSON.parse(localStorage.getItem("token"));
  const [data, setData] = useState([]);
  useEffect(() => {
    Promise.all([
      axios.get(`/news/?author=${username}&publishState=${type}`),
      axios.get(`/categories`),
    ]).then((res) => {
      res[0].data.forEach((item) => {
        item.categories = res[1].data;
      });
      setData(res[0].data);
    });
  }, [username, type]);
  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
    axios.delete(`/news/${id}`).then((res) => {
      notification.info({
        message: `通知`,
        description: `您已经删除了已下线的新闻`,
        placement: "bottomRight",
      });
    });
  };
  const handlePublish = (id) => {
    setData(data.filter((item) => item.id !== id));
    axios
      .patch(`/news/${id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到【发布管理/已经发布】中查看您的新闻`,
          placement: "bottomRight",
        });
      });
  };
  const handleSunset = (id) => {
    setData(data.filter((item) => item.id !== id));
    axios
      .patch(`/news/${id}`, {
        publishState: 3,
      })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到【发布管理/已下线】中查看您的新闻`,
          placement: "bottomRight",
        });
      });
  };
  return { data, handleDelete, handlePublish, handleSunset };
}
export default usePublish;
