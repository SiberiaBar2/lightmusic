import styled from "@emotion/styled";
import SongsItem from "components/SongsItem";
import { MutableRefObject, useRef } from "react";
import { CardList, MusciCard, Songs } from "../index";
import { useRankingSongs } from "./utils";

export const CardSongs = (item: any) => {
  //   console.log("item.id", item.id);

  // const songRef: MutableRefObject<any> = useRef();

  // console.log("songIndex", songRef.current?.songIndex);

  const { data: { playlist: { tracks } } = { playlist: { tracks: [] } } } =
    useRankingSongs(item.id);
  //   console.log("data", tracks);
  // console.log("item", item.name);

  // console.log("sssssssssss");

  return (
    <Container>
      <MusciCard {...item} />
      <CardList custom style={{ flex: 1 }} dataSource={tracks.slice(0, 5)}>
        <SongsItem />
      </CardList>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
