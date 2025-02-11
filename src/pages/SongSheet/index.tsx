import { useSelector } from "react-redux";
import { Empty } from "antd";

import { CardList } from "components";
import { AntCard } from "components/AntCard";
import { RootState } from "store";
import { LoginState } from "store/login";
import { arrAdds } from "utils/utils";
import { useUserPlayList } from "./utils";

export const SongSheet: React.FC = () => {
  const loginState = useSelector<RootState, Pick<LoginState, "data">>(
    (state) => state.login
  );
  const { data: { data: { profile = {} } = {} } = {} } = loginState;

  const { data: { playlist = [] } = {} } = useUserPlayList(profile.userId);

  // console.log("data ---->", playlist);

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
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  };

  return <div>{renderFunc()}</div>;
};
