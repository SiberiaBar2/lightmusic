import React from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import {
  asideList,
  noLoginAsideList,
  ROUTERPATH,
  NOLOGINROUTERPATH,
} from "../contants";
import { useLogin } from "body/Header/utils";

type MenuItem = Required<MenuProps>["items"][number];

export const Aside: React.FC = () => {
  const navigate = useNavigate();
  const loginStatus = useLogin();
  const items: MenuItem[] = (loginStatus ? asideList : noLoginAsideList).map(
    (aside) => {
      return {
        key: aside,
        label: aside,
      };
    }
  );

  const nowSecKey =
    (sessionStorage.getItem("secondKeys") as string) || "推荐歌单";
  const defaultMenu = sessionStorage.getItem("subMenu") as string;

  const onClick: MenuProps["onClick"] = (e) => {
    sessionStorage.setItem("subMenu", e.keyPath[1]);
    sessionStorage.setItem("secondKeys", e.key);
    navigate(`${loginStatus ? ROUTERPATH[e.key] : NOLOGINROUTERPATH[e.key]}`);
  };

  return (
    <AntMenu
      theme={"light"}
      onClick={onClick}
      defaultOpenKeys={[defaultMenu]}
      mode="inline"
      items={items}
      selectedKeys={[nowSecKey]}
    />
  );
};

const AntMenu = styled(Menu)`
  width: 20rem;
  height: 80%;
  background: rgb(250, 250, 252);
`;
