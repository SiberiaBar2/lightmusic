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
  const songIdList = dataSource?.map((item) => {
    return (item as any).id;
  });

  const addConfig = (item: any, index: number, children: React.ReactNode) => {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...item,
        key: item.id,
        songIdList: songIdList,
        songIndex: index,
        prev: Array.isArray(dataSource) && (dataSource[index - 1] as any)?.id,
        next: Array.isArray(dataSource) && (dataSource[index + 1] as any)?.id,
      });
    }
    console.error("CardList 必须传入react元素！");
  };

  return (
    <>
      <AntList
        dataSource={dataSource}
        renderItem={(item: any, index: number) => (
          <List.Item>{addConfig(item, index, children)}</List.Item>
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
