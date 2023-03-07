import { CardList } from "components";
import SongsItem from "components/SongsItem";
import { useRecommendSongs } from "pages/RecommendSongSheet/utils";
import { config } from "utils/customRender";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { LoginState } from "store/login";

export const RecommendSongs: React.FC = () => {
  const loginState = useSelector<RootState, Pick<LoginState, "data">>(
    (state) => state.login
  );
  const { data: { data: { profile = {} } = {} } = {} } = loginState;
  const { data: { data: { dailySongs = [] } = {} } = {} } = useRecommendSongs();

  console.log("data ---->", dailySongs);

  const renderFunc = () => {
    if (profile?.userId) {
      return (
        <CardList many={config} dataSource={dailySongs}>
          <SongsItem />
        </CardList>
      );
    }
    return <span>暂无数据</span>;
  };

  return <div>{renderFunc()}</div>;
};
