import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import { Keys } from "types";
import { songsInfo, songsState } from "store/songs";
import { RootState } from "store";
import { changePlay } from "store/play";
import { debounce } from "utils/utils";
import { likeState } from "store/ilike";
import { useHttp } from "utils";
// import { useRequest } from "hooks/useRequest";

type StrategyType = { [x: string | number]: () => void };

export const useDouble = <T, K, U>(id: T, songindex: K, songidlist: U) => {
  const dispatch = useDispatch();
  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);

  const likeState = useSelector<RootState, Pick<likeState, "likes">>((state) =>
    _.pick(state.ilike, ["likes"])
  );

  const client = useHttp();
  const cookie = localStorage.getItem("cookie");
  // const { run } = useRequest(
  //   async (config) =>
  //     // client("personalized"),
  //     client("/playmode/intelligence/list", {
  //       data: {
  //         id: config.id,
  //         pid: "24381616",
  //         cookie: cookie,
  //       },
  //       method: "GET",
  //     }),
  //   {
  //     // responsePath:,
  //     manual: true,
  //   },
  //   {
  //     success(res) {
  //       console.log("rrrrr", res);
  //     },
  //   }
  // );

  const { likes } = likeState;

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
      dispatch(changePlay({ play: "init" }));
    },
    [Keys.double]: function () {
      const islike = likes.includes(id as number);

      // console.log("islike", islike, "id", id);

      // if (islike) {
      //   run({
      //     id: id,
      //   });
      // }

      dispatch(
        songsInfo({
          ...songsState,
          songId: id,
          song: songindex,
          prevornext: String(songidlist),
        })
      );
      dispatch(changePlay({ play: "play" }));
    },
  };

  return [strategy, debounce] as const;
};
