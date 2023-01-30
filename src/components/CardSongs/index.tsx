import styled from "@emotion/styled";
import SongsItem from "components/SongsItem";
import { config } from "utils/customRender";
import { CardList, MusciCard } from "../index";
import { useRankingSongs } from "./utils";

export const CardSongs = (props: any) => {
  const { item } = props;
  const { data: { playlist: { tracks } } = { playlist: { tracks: [] } } } =
    useRankingSongs(item.id);
  // console.log("data", tracks);
  // console.log("item", item.name);

  // console.log("sssssssssss");

  return (
    <Container>
      <MusciCard item={item} />
      <CardList
        many={config}
        style={{ flex: 1 }}
        dataSource={tracks.slice(0, 5)}
      >
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
