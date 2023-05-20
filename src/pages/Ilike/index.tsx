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

  // 解构赋值 真正的默认值
  // const { data: { data: { profile: { userId = 0 } = {} } = {} } = {} } =
  // loginState;
  // console.log("likes", likes);

  const { data: { songs = [] } = {} } = useSongDetail(
    likes.join(",")
    // likes.slice(30).join(",")
  );
  // console.log("songs", songs);

  return (
    <div>
      <CardList many={config} dataSource={songs}>
        <SongsItem />
      </CardList>
    </div>
  );
};
