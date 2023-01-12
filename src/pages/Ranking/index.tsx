import { RANGKING } from "./contants";
import { useRanking } from "./utils";
import { MusciCard, CardList } from "components";
import { CardSongs } from "components/CardSongs";

export const Ranking = () => {
  const { data: { list: ranking, artistToplist } = RANGKING } = useRanking();

  return (
    <>
      <CardList dataSource={ranking.slice(0, 4)}>
        <CardSongs />
      </CardList>
      <CardList
        grid={{ column: 4, lg: 4, xs: 2, xxl: 5 }}
        dataSource={ranking.slice(4)}
      >
        <MusciCard />
      </CardList>
    </>
  );
};
