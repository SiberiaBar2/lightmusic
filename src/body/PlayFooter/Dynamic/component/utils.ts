import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { changePlay } from "store/play";
import { songsInfo, songsState } from "store/songs";

interface ToggleSongs {
  play: string | undefined;
  songsState: Pick<songsState, "songId" | "song" | "prevornext">;
  song: string | number;
  prevornext: string;
}

export const useToggleSongs = ({
  prevornext,
  song,
  songsState,
  play,
}: ToggleSongs) => {
  const dispatch = useDispatch();
  return useCallback(
    (key: string, reback?: string) => {
      let togo = key === "prev" ? Number(song) - 1 : Number(song) + 1;
      const getSongsId = prevornext.split(",").map((ele: any) => Number(ele));
      const min = 0;
      const max = getSongsId?.length - 1;

      if (togo < min) {
        togo = max;
      }
      if (togo > max) {
        togo = 0;
      }
      // 生成一个歌曲列表下标数组之内的随机数
      if (reback === "random") {
        togo = Math.round(Math.random() * max);
      }

      dispatch(
        songsInfo({
          ...songsState,
          songId: getSongsId[togo],
          song: togo,
        })
      );
      localStorage.setItem("musicTime", "0");
      play !== "play" && dispatch(changePlay({ play: "play" }));
    },
    // 未加依赖项 陷入闭包陷阱 要注意传入的props并非useCallback函数的直接函数参数
    // 因此必须指定依赖项
    [changePlay, songsInfo, prevornext, song, songsState, play]
  );
};
