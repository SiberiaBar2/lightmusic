import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

export const MusciCard = (item: any) => {
  const navigate = useNavigate();

  return (
    <Container>
      <Img
        src={item.coverImgUrl}
        alt={item.name}
        onClick={() => navigate(`/songlist/${item.id}`)}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 10rem;
  height: 10rem;
  cursor: pointer;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
`;

// type a = typeof MusciCard
