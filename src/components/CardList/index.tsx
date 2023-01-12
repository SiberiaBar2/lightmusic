import React from "react";
import { List } from "antd";
import styled from "@emotion/styled";

interface CardListProps
  extends React.PropsWithChildren<React.ComponentProps<typeof List>> {
  custom?: boolean;
}

export const CardList = ({
  children,
  dataSource,
  custom,
  ...other
}: CardListProps) => {
  const addConfig = (item: any, children: React.ReactNode) => {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        key: item.id,
        ...item,
      });
    }
    console.error("CardList 必须传入react元素！");
  };

  return (
    <>
      <AntList
        dataSource={dataSource}
        renderItem={(item: any) => (
          <List.Item>{addConfig(item, children)}</List.Item>
        )}
        {...other}
      />
      {custom ? <div style={{ padding: "0 2.2rem " }}>更多</div> : null}
    </>
  );
};

const AntList = styled(List)`
  padding: 1rem;
`;
