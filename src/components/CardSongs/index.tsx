import styled from "@emotion/styled";
import SongsItem from "components/SongsItem";
import { config } from "utils/customRender";
import { CardList, MusciCard } from "../index";
import { useRankingSongs } from "./utils";

export const CardSongs: React.FC<{ item?: any }> = (props) => {
  const { item } = props;
  const { data } = useRankingSongs(item.id);

  return (
    <Container>
      <MusciCard item={item} />
      <CardList
        many={config}
        style={{ flex: 1 }}
        maxRender={5}
        dataSource={data?.playlist?.tracks}
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
