import React, { useEffect } from "react";
import { Layout } from "antd";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import SideMenu from "../../components/sanBox/SideMenu";
import TopHeader from "../../components/sanBox/TopHeader";
import NewsRouter from "../../components/sanBox/NewsRouter";
import "./NewsSandBox.css";
const { Content } = Layout;
const NewsSandBox = () => {
  NProgress.start();
  useEffect(() => {
    NProgress.done();
  });
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  );
};

export default NewsSandBox;
