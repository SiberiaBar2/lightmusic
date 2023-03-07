import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { changePlay } from "store/play";
import { songsInfo, songsState } from "store/songs";
import { stringAdds } from "utils/utils";

export const IsSame: React.FC<any> = (props) => {
  const { songindex, songidlist, item } = props;

  const dispatch = useDispatch();
  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);

  const { name, artists, album, id } = item;
  const { name: authname } = artists[0];
  const { picUrl } = album;

  return (
    <Container
      onClick={() => {
        dispatch(
          songsInfo({
            ...songsState,
            songId: id,
            song: songindex,
            prevornext: String(songidlist),
          })
        );
        dispatch(changePlay({ play: false }));
      }}
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
  &:hover {
    background: rgb(240, 161, 168);
  }
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
