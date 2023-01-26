import { CardList } from "components";
import SongsItem from "components/SongsItem";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { LoginState } from "store/login";
import { useIlike } from "users";
import { useSongDetail } from "./utils";
import { config } from "utils/customRender";
const DATEFORMAT = "YYYY-MM-DD HH:mm:ss";

export const Ilike = () => {
  const loginState = useSelector<RootState, Pick<LoginState, "data">>(
    (state) => state.login
  );

  // 解构赋值 真正的默认值
  const { data: { data: { profile: { userId = 0 } = {} } = {} } = {} } =
    loginState;

  // console.log("loginState", loginState, "data。", userId);
  //   console.log("parparpar", searchparam);
  //   const { data: refresh } = useRefreshLogin();
  //   console.log("refresh", refresh);

  // const [param, setParam] = useSongIdSearchParam();
  const { data: { ids = [] } = {} } = useIlike(userId);

  // console.log('ids.join(",")', ids.join(","));

  const { data: { songs = [] } = {} } = useSongDetail(ids.join(","));
  //   const { mutate: enterSearch, data } = useCloudsearch();

  //   const { result: { songs, songCount } = { songs: [], songCount: 0 } } = data;
  //   console.log("songs", songs, "songCount", songCount);

  //   useMemo(() => {
  //     enterSearch({ keywords: param.searchparam });
  //   }, [param.searchparam]);
  // console.log("param", param);
  // console.log("我喜欢", ids);
  // console.log("详情", songs);

  return (
    <div>
      <CardList many={config} dataSource={songs}>
        <SongsItem />
      </CardList>
    </div>
  );
};
