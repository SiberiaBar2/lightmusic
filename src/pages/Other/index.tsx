import styled from "@emotion/styled";
import { Card, Space } from "antd";

const OTHERLIST = [
  { text: "服务", link: "NeteaseCloudMusicApi" },
  { text: "博客", link: "https://karlfranz.cn/" },
  { text: "github", link: "https://github.com/SiberiaBar2/" },
  { text: "color", link: "http://zhongguose.com/" },
  { text: "ui", link: "ant-designV5" },
];
export const Other = () => {
  return (
    <AntCard>
      {OTHERLIST.map(function (ele) {
        return (
          <p key={ele.text}>
            <Space>
              <span>{ele.text}: </span>
              <Span>{ele.link}</Span>
            </Space>
          </p>
        );
      })}
    </AntCard>
  );
};

const AntCard = styled(Card)`
  width: 110rem;
  height: 50rem;
`;

const Span = styled.span`
  color: rgb(93, 49, 49);
`;
