/*
 * @Descripttion:
 * @version: X3版本
 * @Author: 吴毛三
 * @Date: 2022-01-07 22:21:19
 * @LastEditors: 吴毛三
 * @LastEditTime: 2022-02-13 22:56:07
 */
import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Spin } from "antd";
import RoleList from "../../views/sandBox/right-mange/RoleList";
import RightList from "../../views/sandBox/right-mange/RightList";
import Home from "../../views/sandBox/home/Home";
import UserList from "../../views/sandBox/user-mange/UserList";
import NoPermission from "../../views/sandBox/noperMission/NoPermission";
import NewsAdd from "../../views/sandBox/news-manage/NewsAdd";
import NewsDraft from "../../views/sandBox/news-manage/NewsDraft";
import NewsCategory from "../../views/sandBox/news-manage/NewsCategory";
import Audit from "../../views/sandBox/audit-manage/Audit";
import AuditList from "../../views/sandBox/audit-manage/AuditList";
import Unpublished from "../../views/sandBox/publish-manage/Unpublished";
import Published from "../../views/sandBox/publish-manage/Published";
import Sunset from "../../views/sandBox/publish-manage/Sunset";
import axios from "axios";
import Preview from "../../views/sandBox/news-manage/Preview";
import NewsUpdate from "../../views/sandBox/news-manage/NewsUpdate";
import { connect } from "react-redux";
const localRouter = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset,
  "/news-manage/preview/:id": Preview,
  "/news-manage/update/:id": NewsUpdate,
};
const NewsRouter = (props) => {
  const [BackRouterList, setBackRouterList] = useState([]);
  useEffect(() => {
    Promise.all([axios.get("/rights"), axios.get("/children")])
      .then((res) => {
        setBackRouterList([...res[0].data, ...res[1].data]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));
  const checkRoute = (item) => {
    return localRouter[item.key] && (item.pagepermisson || item.routepermisson);
  };
  const checkUserPermission = (item) => {
    return rights.includes(item.key);
  };
  return (
    <Spin size="large" spinning={props.isLoading}>
      <Switch>
        {BackRouterList.length > 0 &&
          BackRouterList.map((item) => {
            if (checkRoute(item) && checkUserPermission(item))
              return (
                <Route
                  path={item.key}
                  key={item.key}
                  component={localRouter[item.key]}
                  exact
                ></Route>
              );
            return null;
          })}
        <Redirect from="/" to="/home" exact />
        {BackRouterList.length > 0 && (
          <Route path="*" component={NoPermission} />
        )}
      </Switch>
    </Spin>
  );
};
const mapStateToProps = ({ LoadingReducer: { isLoading } }) => ({ isLoading });
export default connect(mapStateToProps)(NewsRouter);
