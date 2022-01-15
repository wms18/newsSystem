import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import RoleList from "../../views/sandBox/right-mange/RoleList";
import RightList from "../../views/sandBox/right-mange/RightList";
import Home from "../../views/sandBox/home/Home";
import UserList from "../../views/sandBox/user-mange/UserList";
import NoPermission from "../../views/sandBox/nopermission/NoPermission";
import NewsAdd from "../../views/sandBox/news-manage/NewsAdd";
import NewsDraft from "../../views/sandBox/news-manage/NewsDraft";
import NewsCategory from "../../views/sandBox/news-manage/NewsCategory";
import Audit from "../../views/sandBox/audit-manage/Audit";
import AuditList from "../../views/sandBox/audit-manage/AuditList";
import Unpublished from "../../views/sandBox/publish-manage/Unpublished";
import Published from "../../views/sandBox/publish-manage/Published";
import Sunset from "../../views/sandBox/publish-manage/Sunset";
import axios from "axios";
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
};
const NewsRouter = () => {
  const [BackRouterList, setBackRouterList] = useState([]);
  useEffect(() => {
    Promise.all([
      axios.get( "/rights"),
      axios.get( "/children"),
    ])
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
    return localRouter[item.key] && item.pagepermisson;
  };
  const checkUserPermission = (item) => {
    return rights.includes(item.key);
  };
  return (
    <Switch>
      {BackRouterList.map((item) => {
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
      {BackRouterList.length > 0 && <Route path="*" component={NoPermission} />}
    </Switch>
  );
};
export default NewsRouter;
