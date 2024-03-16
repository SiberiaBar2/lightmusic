import _ from "lodash";
import { CardList } from "components";
import SongsItem from "components/SongsItem";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useSongDetail } from "./utils";
import { config } from "utils/customRender";
import { likeState } from "store/ilike";

export const Ilike: React.FC = () => {
  const likeState = useSelector<RootState, Pick<likeState, "likes">>((state) =>
    _.pick(state.ilike, ["likes"])
  );
  const { likes } = likeState;
  const { data: { songs = [] } = {} } = useSongDetail(likes.join(","));

  return (
    <div>
      <CardList many={config} dataSource={songs}>
        <SongsItem />
      </CardList>
    </div>
  );
};
