import { Fragment } from "react";
import { RANGKING } from "./contants";
import { useRanking } from "./utils";
import { MusciCard, CardList } from "components";
import { CardSongs } from "components/CardSongs";
import { arrAdds } from "utils/utils";

export const Ranking = () => {
  const { data: { list: ranking, artistToplist } = RANGKING } = useRanking();

  return (
    <Fragment>
      <CardList dataSource={arrAdds(ranking.slice(0, 4), "coverImgUrl")}>
        <CardSongs />
      </CardList>
      <CardList
        grid={{ column: 4, lg: 4, xs: 2, xxl: 5 }}
        dataSource={arrAdds(ranking.slice(4), "coverImgUrl")}
      >
        <MusciCard />
      </CardList>
    </Fragment>
  );
};
