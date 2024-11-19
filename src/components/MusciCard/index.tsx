import styled from "@emotion/styled";
import { Tag, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";

interface Props {
  item?: any;
  customrender?: (value: any) => JSX.Element;
  songIndex?: number;
}

export const MusciCard: React.FC<Props> = (props) => {
  const { customrender, songIndex: index, item } = props;
  const navigate = useNavigate();

  const renderTag = (index: number) => {
    return (
      <Tag color={index % 2 === 0 ? "purple" : "geekblue"}>
        {item.name.slice(0, 15)}
      </Tag>
    );
  };

  return (
    <>
      {customrender ? (
        <Tooltip title={item.name}>
          {/* <Name> */}
          {renderTag(index as number)}
          {/* </Name> */}
        </Tooltip>
      ) : null}
      <Container>
        <Img
          src={item.coverImgUrl}
          alt={item.name}
          // 前面加/ 避免多重url路径，原理暂时不知
          onClick={() => navigate(`/main/songlist/${item.id}`)}
        />
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 16rem;
  height: 16rem;
  cursor: pointer;
  margin: 0.3rem;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 1rem;
`;

// type a = typeof MusciCard
const Name = styled.div`
  /* height: 1.5rem; */
  /* width: 70%; */
  /* margin: 0.5rem; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
