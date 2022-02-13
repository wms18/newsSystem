/*
 * @Descripttion:
 * @version: X3版本
 * @Author: 吴毛三
 * @Date: 2022-01-07 23:33:13
 * @LastEditors: 吴毛三
 * @LastEditTime: 2022-01-30 02:00:49
 */
import { Button } from "antd";
import React from "react";
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";
const Sunset = () => {
  const { data, handleDelete } = usePublish(3);
  return (
    <div>
      <NewsPublish
        data={data}
        type={0}
        button={(id) => (
          <Button danger onClick={() => handleDelete(id)}>
            删除
          </Button>
        )}
      ></NewsPublish>
    </div>
  );
};

export default Sunset;
