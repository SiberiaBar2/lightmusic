import { Divider } from "antd";
import styled from "@emotion/styled";
import { useHotList } from "./utils";

export const HotList = () => {
  const { data: { data } = { data: [] } } = useHotList();

  //   console.log("热", data);

  return (
    <Container>
      <Divider orientation="left">热搜榜</Divider>
      {data.map((item: any, index: number) => {
        return (
          <p key={item.searchWord}>
            <span>
              <span>{index + 1}</span>
              {item.searchWord}
            </span>
            <span>{item?.content}</span>
          </p>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  font-size: 0.8rem;

  p {
    height: 3rem;
    margin: 1rem 0;
    padding: 0.2rem 0.5rem;
    background: rgb(240, 201, 207);
    cursor: pointer;

    span:nth-of-type(1) {
      font-weight: 700;
      margin-bottom: 0.2rem;

      span {
        display: inline-block;
        margin-right: 1rem;
      }
    }

    span:nth-of-type(2) {
      color: rgb(122, 115, 116);
    }
  }

  span {
    display: block;
  }
`;
