import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Tooltip } from "antd";
import styled from "@emotion/styled";

type CardProps = React.PropsWithChildren<React.ComponentProps<typeof Card>>;

export const AntCard: React.FC<CardProps & { item?: any }> = ({
  children,
  item,
  ...other
}) => {
  const navigate = useNavigate();
  const { picUrl, name, coverImgUrl, id } = item;

  return (
    <Antcard onClick={() => navigate(`/main/songlist/${id}`)} {...other}>
      <Img src={picUrl || coverImgUrl} alt="" />
      <Tooltip title={name}>
        <p>{name?.slice(0, 12)}</p>
      </Tooltip>
    </Antcard>
  );
};

const Antcard = styled(Card)`
  width: 18rem;
  height: 20rem;
  cursor: pointer;
  background: transparent;
  border: none;

  p:nth-of-type(1) {
    margin: 0;
    font-size: 1rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 1rem;
`;
