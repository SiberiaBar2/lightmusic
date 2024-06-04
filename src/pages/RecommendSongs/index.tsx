import React from "react";
import { useSelector } from "react-redux";
import { Empty } from "antd";

import { CardList } from "components";
import SongsItem from "components/SongsItem";
import { useRecommendSongs } from "pages/RecommendSongSheet/utils";
import { config } from "utils/customRender";
import { RootState } from "store";
import { LoginState } from "store/login";
import { useHttp } from "utils";
import { useQuery } from "@karlfranz/reacthooks";

export const RecommendSongs: React.FC = React.memo(() => {
  const loginState = useSelector<RootState, Pick<LoginState, "data">>(
    (state) => state.login
  );
  const { data: { data: { profile = {} } = {} } = {} } = loginState;
  // const { data: { data: { dailySongs = [] } = {} } = {} } = useRecommendSongs();

  console.log("render次数");

  const client = useHttp();
  const { data: { data: { dailySongs = [] } = {} } = {} as any } = useQuery(
    () =>
      client("recommend/songs", {
        data: {
          cookie: localStorage.getItem("cookie"),
        },
      }),
    {
      refreshOnWindowFocus: true,
      success(res) {
        console.log("查看返回", res);
      },
    }
  );
  // console.log("data ---->", dailySongs);

  const renderFunc = () => {
    console.log("profile?.userId", profile?.userId);

    if (profile?.userId) {
      return (
        <CardList many={config} dataSource={dailySongs}>
          <SongsItem />
        </CardList>
      );
    }
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  };

  return <div>{renderFunc()}</div>;
});
