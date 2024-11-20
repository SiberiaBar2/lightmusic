import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";

import SongsItem from "components/SongsItem";
import { config } from "utils/customRender";
import { songsState } from "store/songs";
import { LoginState } from "store/login";
import { CardList } from "components";
import { RootState } from "store";
import { https } from "utils";

export const Ilike: React.FC = () => {
  const loginState = useSelector<RootState, Pick<LoginState, "data">>(
    (state) => state.login
  );
  const songsState = useSelector<RootState, Pick<songsState, "platList">>(
    (state) => state.songs
  );

  const { data } = loginState;

  const [playlist, setPlaylist] = useState<any[]>(songsState?.platList || []);
  const client = https();
  const getLikeList = async (uid: number) => {
    const res = await client("user/playlist", {
      data: { uid },
    });
    const playlistResult = await client("playlist/detail", {
      data: { id: res?.playlist?.[0]?.id },
    });
    setPlaylist(_.get(playlistResult, "playlist.tracks"));
  };

  const userId = _.get(data, "data.profile.userId");
  useEffect(() => {
    if (userId) {
      getLikeList(userId);
    }
  }, [userId]);

  return (
    <div>
      <CardList many={config} dataSource={playlist}>
        <SongsItem />
      </CardList>
    </div>
  );
};
