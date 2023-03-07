import { CardList } from "components";
import SongsItem from "components/SongsItem";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { LoginState } from "store/login";
import { useSongDetail } from "./utils";
import { config } from "utils/customRender";
import { likeState } from "store/ilike";
import _ from "lodash";
const DATEFORMAT = "YYYY-MM-DD HH:mm:ss";

// 鉴于歌单包含了我喜欢 舍弃ilike
// 再次启用
export const Ilike: React.FC = () => {
  // const loginState = useSelector<RootState, Pick<LoginState, "data">>(
  //   (state) => state.login
  // );
  const likeState = useSelector<RootState, Pick<likeState, "likes">>((state) =>
    _.pick(state.ilike, ["likes"])
  );

  const { likes } = likeState;
  // 解构赋值 真正的默认值
  // const { data: { data: { profile: { userId = 0 } = {} } = {} } = {} } =
  // loginState;

  const { data: { songs = [] } = {} } = useSongDetail(likes.join(","));

  return (
    <div>
      <CardList many={config} dataSource={songs}>
        <SongsItem />
      </CardList>
    </div>
  );
};
