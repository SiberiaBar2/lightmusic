import { CardList, MusciCard } from "components";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { LoginState } from "store/login";
import { useUserPlayList } from "./utils";

export const SongSheet = () => {
  const loginState = useSelector<RootState, Pick<LoginState, "data">>(
    (state) => state.login
  );
  const { data: { data: { profile = {} } = {} } = {} } = loginState;

  const { data: { playlist = [] } = {} } = useUserPlayList(profile.userId);

  console.log("data", playlist);

  // 解构赋值 真正的默认值
  const renderFunc = () => {
    if (profile?.userId) {
      //   console.log("data", data);

      return <span></span>;
    }
    return <span>暂无数据</span>;
  };

  return (
    <CardList grid={{ column: 4, lg: 4, xs: 2, xxl: 5 }} dataSource={playlist}>
      <MusciCard customrender />
    </CardList>
  );
  //   return <div>{renderFunc()}</div>;
};
