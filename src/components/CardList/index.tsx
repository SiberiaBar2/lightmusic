import React from "react";
import { List } from "antd";
import styled from "@emotion/styled";
import _ from "lodash";

interface CardListProps
  extends React.PropsWithChildren<React.ComponentProps<typeof List>> {
  custom?: boolean;
  many?: {
    renderFunc: (value: any) => any;
  };
}

export const CardList = ({
  children,
  dataSource,
  custom,
  many,
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
        songIndex: index,
        songIdList: songIdList,
      });
    }
    console.error("CardList 必须传入react元素！");
  };

  const customRender = (item: any) => {
    if (!_.isEmpty(many)) {
      const { renderFunc } = many;
      return renderFunc(item);
    }
  };

  return (
    <>
      <AntList
        dataSource={dataSource}
        renderItem={(item: any, index: number) => (
          <List.Item>
            {addConfig(item, index, children)}
            {customRender(item)}
          </List.Item>
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
