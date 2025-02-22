import React from "react";
import { List } from "antd";
import styled from "@emotion/styled";

interface CardListProps
  extends React.PropsWithChildren<React.ComponentProps<typeof List>> {
  custom?: boolean;
  many?: {
    renderFunc: (value: any) => JSX.Element;
    color?: string[];
    background?: string[];
  };
  maxRender?: number;
}

export interface childrenReturnType {
  key?: React.Key | null;
  songindex?: number;
  songidlist?: number[];
  customrender?: (value: any) => JSX.Element;
  showLike?: boolean;
  [x: string]: any;
}

export const CardList: React.FC<CardListProps> = React.memo(
  ({ children, dataSource, custom, many, maxRender, ...other }) => {
    console.log("dataSource", dataSource);
    const songidlist = dataSource?.map((item) => {
      return (item as any).id as number;
    });

    const addConfig = (item: any, index: number, children: React.ReactNode) => {
      if (React.isValidElement<childrenReturnType>(children)) {
        return React.cloneElement(children, {
          ...item,
          key: item.id,
          songindex: index,
          songidlist: songidlist,
          customrender: many?.renderFunc,
          item: item,
          dataSource: dataSource,
        });
      }
      console.error("CardList 必须传入react元素！");
    };

    // 单数、双数行颜色设置
    // 排除 many 、 color ， background 可能为 undefined 的情况 undefined上不存在 [0]、[1]
    // const getStyle = (key: string) => {
    //   if (many) {
    //     if (key === "color" && many.color) {
    //       return many.color;
    //     }
    //     if (key === "background" && many.background) {
    //       return many.background;
    //     }
    //     return ["", ""];
    //   }
    //   return ["", ""];
    // };

    // const customStyle = (index: number) => {
    //   return {
    //     color: index % 2 === 0 ? getStyle("color")[0] : getStyle("color")[1],
    //     background:
    //       index % 2 === 0 ? getStyle("background")[0] : getStyle("background")[1],
    //   };
    // };

    const renderDataSource = () => {
      if (maxRender !== undefined) {
        return dataSource?.slice(0, maxRender);
      }
      return dataSource;
    };
    return (
      <>
        <AntList
          dataSource={renderDataSource()}
          renderItem={(item: any, index: number) => (
            // <List.Item style={customStyle(index)}>
            <List.Item style={{ padding: 0 }}>
              {addConfig(item, index, children)}
            </List.Item>
          )}
          {...other}
        />
        {custom ? <div style={{ padding: "0 2.2rem " }}>更多</div> : null}
      </>
    );
  }
);

const AntList = styled(List)`
  padding: 1rem;
`;
