import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import { Keys } from "types";
import { songsInfo, songsState } from "store/songs";
import { RootState } from "store";
import { changePlay } from "store/play";
import { debounce } from "utils/utils";
import { likeState } from "store/ilike";
import { useHttp } from "utils";
import { player } from "./PlayFooter/Dynamic";
// import { useRequest } from "hooks/useRequest";

type StrategyType = { [x: string | number]: () => void };

export const useDouble = <T, K, U>(
  id: T,
  songindex: K,
  songidlist: U,
  platList: any[]
) => {
  const dispatch = useDispatch();
  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);

  const likeState = useSelector<RootState, Pick<likeState, "likes">>((state) =>
    _.pick(state.ilike, ["likes"])
  );

  const { likes } = likeState;

  const strategy: StrategyType = {
    [Keys.single]: function () {
      // dispatch(
      //   songsInfo({
      //     ...songsState,
      //     songId: id,
      //     song: songindex,
      //     prevornext: String(songidlist),
      //   })
      // );
      // dispatch(changePlay({ play: "init" }));
    },
    [Keys.double]: function () {
      player.saveSongConfig({
        prevornext: String(songidlist),
        song: songindex as string,
        songId: id as number,
        platList: platList,
      });
    },
  };

  return [strategy, debounce] as const;
};
