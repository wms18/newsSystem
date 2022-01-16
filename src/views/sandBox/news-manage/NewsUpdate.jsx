import React, { useState, useEffect, useRef } from "react";
import {
  PageHeader,
  Steps,
  Button,
  Form,
  Input,
  Select,
  message,
  notification,
} from "antd";
import styles from "./NewsAdd.module.css";
import axios from "axios";
import NewsEditor from "../../../components/news-manage/NewsEditor";
const NewsUpdate = (props) => {
  const { Step } = Steps;
  const { Option } = Select;
  const [current, setCurrent] = useState(0);
  const [categories, setCategories] = useState([]);
  const [formInfo, setFormInfo] = useState();
  const [newsCont, setNewsCont] = useState();
  const newsForm = useRef(null);
  const newsId = props.match.params.id;
  const { username, region, roleId, id } = JSON.parse(
    localStorage.getItem("token")
  );
  useEffect(() => {
    axios.get("/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);
  useEffect(() => {
    Promise.all([
      axios.get(`/news/${newsId}?_expand=role`),
      axios.get("/categories"),
    ]).then((res) => {
      let { title, category, content } = res[0].data;
      setNewsCont(content);
      newsForm.current.setFieldsValue({ title, category });
    });
  }, [newsId]);
  const renderCategories = () => {
    return categories.map((item) => {
      return (
        <Option key={item.id} value={item.id}>
          {item.title}
        </Option>
      );
    });
  };
  /**
   * @name: 吴毛三
   * @test: test font
   * @msg:
   * @param {*}
   * @return {*}
   */
  const handleNext = () => {
    if (current === 0) {
      newsForm.current
        .validateFields()
        .then((res) => {
          setFormInfo(res);
          setCurrent(current + 1);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      if (newsCont?.trim() === "" || newsCont === undefined) {
        message.error("新闻内容不能为空");
      } else {
        setCurrent(current + 1);
      }
    }
  };
  //保存草稿箱
  const handleSave = (auditState) => {
    axios
      .patch(`/news/${newsId}`, {
        ...formInfo,
        content: newsCont,
        auditState: auditState,
        createTime: Date.now(),
      })
      .then((res) => {
        // console.log(res);
        props.history.push(
          auditState === 0 ? "/news-manage/draft" : "/audit-manage/list"
        );
        notification.info({
          message: "通知",
          description: `您可以到${
            auditState === 0 ? "草稿箱" : "审核列表"
          }中查看您的新闻`,
          placement: "topRight",
        });
      });
  };

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="更新新闻"
        onBack={() => props.history.goBack()}
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>
      <div style={{ marginTop: "50px" }}>
        <div className={current === 0 ? "" : styles.active}>
          <Form
            ref={newsForm}
            name="basic"
            wrapperCol={{
              span: 24,
            }}
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: "请输入新闻标题",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="category"
              rules={[
                {
                  required: true,
                  message: "请选择新闻分类",
                },
              ]}
            >
              <Select>{renderCategories()}</Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : styles.active}>
          <NewsEditor
            handleMessage={(value) => {
              // console.log(value);
              setNewsCont(value);
            }}
            content={newsCont}
          ></NewsEditor>
        </div>
      </div>
      <div style={{ marginTop: "50px" }}>
        {current === 2 && (
          <span>
            <Button type="primary" onClick={() => handleSave(0)}>
              保存草稿箱
            </Button>
            <Button
              danger
              style={{ margin: "0 20px" }}
              onClick={() => handleSave(1)}
            >
              提交审核
            </Button>
          </span>
        )}
        {current < 2 && (
          <Button
            type="primary"
            onClick={() => handleNext()}
            style={{ margin: "0 20px" }}
          >
            下一步
          </Button>
        )}
        {current > 0 && (
          <Button onClick={() => setCurrent(current - 1)}>上一步</Button>
        )}
      </div>
    </div>
  );
};

export default NewsUpdate;
