import { MouseEvent } from "react";
import styled from "@emotion/styled";
import { useDouble } from "body/utils";
import { stringAdds } from "utils/utils";

export const IsSame: React.FC<any> = (props) => {
  const { songindex, songidlist, item } = props;

  const { name, artists, album, id } = item;
  const { name: authname } = artists[0];
  const { picUrl } = album;

  const [strategy, debounce] = useDouble<
    string | number,
    number | undefined,
    string | undefined
  >(id, songindex, String(songidlist), []);

  return (
    <Container
      onClick={debounce((e) => {
        strategy[(e as MouseEvent<Element, MouseEvent>).detail]();
      }, 300)}
    >
      <ImageWrap>
        <img src={stringAdds(picUrl)} alt="" />
      </ImageWrap>
      <Info>
        <p>{name}</p>
        <p>{authname}</p>
      </Info>
    </Container>
  );
};

const Container = styled.div`
  width: 30rem;
  height: 5.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const ImageWrap = styled.div`
  width: 5rem;
  height: 5rem;

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
