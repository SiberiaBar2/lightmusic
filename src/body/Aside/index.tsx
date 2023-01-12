import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { asideList, ROUTERPATH } from "../contants";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = asideList.map((aside) => {
  return {
    key: aside,
    label: aside,
  };
});

export const Aside = () => {
  const [current, setCurrent] = useState("1");
  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    navigate(ROUTERPATH[e.key]);
  };
  return (
    <AntMenu
      theme={"light"}
      onClick={onClick}
      defaultOpenKeys={["sub1"]}
      selectedKeys={[current]}
      mode="inline"
      items={items}
    />
  );
};

const AntMenu = styled(Menu)`
  width: 90%;
  height: 100%;
`;
