import styled from "@emotion/styled";
import { Tooltip } from "antd";
import { useNavigate } from "react-router-dom";

export const MusciCard = (item: any) => {
  const { customrender } = item;
  const navigate = useNavigate();

  return (
    <>
      {customrender ? (
        <Tooltip title={item.name}>
          <Name>{item.name.slice(0, 15)}</Name>
        </Tooltip>
      ) : null}
      <Container>
        <Img
          src={item.coverImgUrl}
          alt={item.name}
          onClick={() => navigate(`/songlist/${item.id}`)}
        />
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 10rem;
  height: 10rem;
  cursor: pointer;
  margin: 0.3rem;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
`;

// type a = typeof MusciCard
const Name = styled.div`
  height: 1.5rem;
  width: 70%;
  margin: 0.5rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
