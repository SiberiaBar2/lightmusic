import React from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@karlfranz/reacthooks";
import { Empty } from "antd";

import SongsItem from "components/SongsItem";
import { config } from "utils/customRender";
import { LoginState } from "store/login";
import { songsState } from "store/songs";
import { CardList } from "components";
import { RootState } from "store";
import { useHttp } from "utils";

export const RecommendSongs: React.FC = React.memo(() => {
  const loginState = useSelector<RootState, Pick<LoginState, "data">>(
    (state) => state.login
  );
  const songsState = useSelector<RootState, Pick<songsState, "platList">>(
    (state) => state.songs
  );
  const { data: { data: { profile = {} } = {} } = {} } = loginState;
  const client = useHttp();
  const {
    data: {
      data: { dailySongs = songsState?.platList || [] } = {},
    } = {} as any,
  } = useQuery(
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

  const renderFunc = () => {
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
