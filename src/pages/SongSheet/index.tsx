import { CardList } from "components";
import { AntCard } from "components/AntCard";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { LoginState } from "store/login";
import { arrAdds } from "utils/utils";
import { useUserPlayList } from "./utils";

export const SongSheet = () => {
  const loginState = useSelector<RootState, Pick<LoginState, "data">>(
    (state) => state.login
  );
  const { data: { data: { profile = {} } = {} } = {} } = loginState;

  const { data: { playlist = [] } = {} } = useUserPlayList(profile.userId);

  console.log("data ---->", playlist);

  const renderFunc = () => {
    if (profile?.userId) {
      return (
        <CardList
          grid={{ column: 4, lg: 4, xs: 2, xxl: 5 }}
          dataSource={arrAdds(playlist.slice(1), "coverImgUrl")}
        >
          <AntCard />
        </CardList>
      );
    }
    return <span>暂无数据</span>;
  };

  return <div>{renderFunc()}</div>;
};
