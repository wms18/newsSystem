/*
 * @Descripttion:
 * @version: X3版本
 * @Author: 吴毛三
 * @Date: 2022-01-07 23:33:13
 * @LastEditors: 吴毛三
 * @LastEditTime: 2022-01-30 02:01:15
 */
import React from "react";
import { Button } from "antd";
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";
const Unpublished = () => {
  const { data, handlePublish } = usePublish(1);
  return (
    <div>
      <NewsPublish
        data={data}
        type={1}
        button={(id) => (
          <Button type={"primary"} onClick={() => handlePublish(id)}>
            发布
          </Button>
        )}
      ></NewsPublish>
    </div>
  );
};

export default Unpublished;
