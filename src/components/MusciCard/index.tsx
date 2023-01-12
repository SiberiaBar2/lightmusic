import styled from "@emotion/styled";

export const MusciCard = (item: any) => {
  return (
    <Container>
      <Img src={item.coverImgUrl} alt={item.name} />
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
