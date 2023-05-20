import { Divider, Tooltip } from "antd";
import styled from "@emotion/styled";
import { useHotList } from "./utils";
import { useNavigate } from "react-router-dom";

export const HotList: React.FC<{
  handelBlue: () => void;
}> = (props) => {
  const { handelBlue } = props;
  const { data: { data } = { data: [] } } = useHotList();
  const navigate = useNavigate();

  const goSearchHot = (keywords: string) => {
    navigate(`search/${keywords}`);
    handelBlue();
  };

  return (
    <Container>
      <Divider orientation="left">热搜榜</Divider>
      {data.map((item: any, index: number) => {
        return (
          <p key={item.searchWord} onClick={() => goSearchHot(item.searchWord)}>
            <span>
              <span>{index + 1}</span>
              {item.searchWord}
            </span>
            <Tooltip title={item?.content}>
              <span>{item?.content.slice(0, 13)}</span>
            </Tooltip>
          </p>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  font-size: 0.8rem;

  p {
    height: 4rem;
    margin: 1rem 0;
    padding: 0.2rem 1rem;
    border-radius: 0.5rem;
    margin: 0 0.3rem;
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 0, 0.4);
    }

    span:nth-of-type(1) {
      font-weight: 700;
      margin-bottom: 0.2rem;

      span {
        display: inline-block;
        margin-right: 1rem;
      }
    }

    span:nth-of-type(2) {
      /* color: rgb(50, 47, 59); */
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      width: 80%;
    }
  }

  span {
    display: block;
  }
`;
