import { useDispatch, useSelector } from "react-redux";
import { Keys } from "types";
import { songsInfo, songsState } from "store/songs";
import { RootState } from "store";
import { changePlay } from "store/play";
import { debounce } from "utils/utils";

type StrategyType = { [x: string | number]: () => void };

export const useDouble = <T, K, U>(id: T, songindex: K, songidlist: U) => {
  const dispatch = useDispatch();
  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);

  const strategy: StrategyType = {
    [Keys.single]: function () {
      dispatch(
        songsInfo({
          ...songsState,
          songId: id,
          song: songindex,
          prevornext: String(songidlist),
        })
      );
      dispatch(changePlay({ play: false }));
    },
    [Keys.double]: function () {
      console.log("double");
      dispatch(
        songsInfo({
          ...songsState,
          songId: id,
          song: songindex,
          prevornext: String(songidlist),
        })
      );
      dispatch(changePlay({ play: true }));
    },
  };

  return [strategy, debounce] as const;
};
