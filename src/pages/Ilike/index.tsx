import styled from "@emotion/styled";
import { useCloudsearch } from "body/Header/utils";
import { CardList } from "components";
import SongsItem from "components/SongsItem";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { LoginState } from "store/login";
import { useIlike, useRefreshLogin } from "users";
import { useSongDetail } from "./utils";
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

  const renderFunc = (value: any) => {
    const { ar } = value;
    const authAndtime = ar.map((ele: any, index: number) => {
      if (index === 0) {
        return ele.name + "  ";
      }
      return "/" + "  " + ele.name;
    });

    // const formatTime = dayjs(publishTime).format(DATEFORMAT);

    // authAndtime.push(<span>{formatTime}</span>);
    return <Container>{authAndtime}</Container>;
  };

  const config = {
    renderFunc,
    // color: ["rgb(167, 83, 90)", "rgb(167, 83, 90)"],
    // background: ["rgb(240, 161, 168)", "rgb(241, 147, 156)"],
  };

  return (
    <div>
      <CardList many={config} dataSource={songs}>
        <SongsItem />
      </CardList>
    </div>
  );
};

const Container = styled.div`
  width: 50%;
  display: flex;
  justify-content: space-between;
`;
