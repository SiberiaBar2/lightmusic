import styled from "@emotion/styled";

export const IsSame = (props: any) => {
  const { name, id, artists } = props;
  const { name: authname, picUrl } = artists[0];
  return (
    <Container>
      <ImageWrap>
        <img src={picUrl} alt="" />
      </ImageWrap>
      <Info>
        <p>{name}</p>
        <p>{authname}</p>
      </Info>
    </Container>
  );
};

const Container = styled.div`
  height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
  background: rgb(208, 223, 230);
  cursor: pointer;
`;

const ImageWrap = styled.div`
  width: 4rem;
  height: 4rem;

  img {
    width: 100%;
    height: 100%;
  }
`;

const Info = styled.div`
  width: calc(100% - 4rem);
  height: 100%;

  p {
    margin: 0.5rem 0.3rem;
  }
`;
