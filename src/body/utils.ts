import { Keys } from "types";
import { debounce } from "utils/utils";
import { player } from "./PlayFooter/Dynamic";

type StrategyType = { [x: string | number]: () => void };

export const useDouble = <T, K, U>(
  id: T,
  songindex: K,
  songidlist: U,
  platList: any[]
) => {
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
