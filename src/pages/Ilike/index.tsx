import _ from "lodash";
import { CardList } from "components";
import SongsItem from "components/SongsItem";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useSongDetail } from "./utils";
import { config } from "utils/customRender";
import { likeState } from "store/ilike";
import { songsState } from "store/songs";
import { LoginState } from "store/login";
import { https } from "utils";
import { useEffect, useState } from "react";
import { useQuery } from "@karlfranz/reacthooks";
import { useRankingSongs } from "components/CardSongs/utils";

export const Ilike: React.FC = () => {
  const loginState = useSelector<RootState, Pick<LoginState, "data">>(
    (state) => state.login
  );
  const songsState = useSelector<RootState, Pick<songsState, "platList">>(
    (state) => state.songs
  );

  // console.log("songsStatesongsState", songsState);

  const { data } = loginState;

  const [playlist, setPlaylist] = useState<any[]>([]);
  const client = https();
  const getLikeList = async (uid: number) => {
    if (playlist.length == 0) {
      const res = await client("user/playlist", {
        data: { uid },
      });

      const playlistResult = await client("playlist/detail", {
        data: { id: res?.playlist?.[0]?.id },
      });

      // console.log("resresres", res, res?.playlist?.[0]?.id);
      // console.log("playlist", playlist);
      setPlaylist(_.get(playlistResult, "playlist.tracks"));
    }
  };

  const { run: getUserPlaylist, data: playList } = useQuery(
    ({ userId }: { userId: string }) =>
      client("user/playlist", {
        data: {
          uid: userId,
        },
      }),
    {
      responsePath: "playlist",
      manual: true,
      success(res) {
        getLikeList(_.get(res, "data.[0].id"));
      },
    }
  );

  const userId = _.get(data, "data.profile.userId");
  useEffect(() => {
    if (userId) {
      console.log("1111", userId);
      getLikeList(userId);
    }
  }, [userId]);

  // const { data } = useRankingSongs(playList?.[0]?.id);

  // console.log("data=====>", data);
  // console.log("playlistplaylist====>", playlist);

  return (
    <div>
      <CardList many={config} dataSource={songsState?.platList || playlist}>
        <SongsItem />
      </CardList>
    </div>
  );
};
