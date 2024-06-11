import { MutableRefObject, useCallback } from "react";
import { useDispatch } from "react-redux";

import { changePlay } from "store/play";
import { songsInfo, songsState } from "store/songs";

interface ToggleSongs {
  play: string | undefined;
  songsState: Pick<songsState, "songId" | "song" | "prevornext">;
  song: string | number;
  prevornext: string;
  musicRef: MutableRefObject<HTMLAudioElement>;
}

export const useToggleSongs = ({
  prevornext,
  song,
  songsState,
  play,
  musicRef,
}: ToggleSongs) => {
  const dispatch = useDispatch();
  return useCallback(
    (key: string, reback?: string) => {
      let copyPlay = "play";
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

      if (key === "autonext") {
        if (reback === "dan") {
          togo = Number(song);
          musicRef.current.currentTime = 0;
          musicRef.current?.play();
        }
        if (getSongsId?.length - 1 === 0 && togo === 0 && reback === "liexun") {
          musicRef.current.currentTime = 0;
          musicRef.current?.play();
        }

        if (reback === "shun" && getSongsId?.length - 1 === song) {
          copyPlay = "pause";
          togo = Number(song);
        }
        // 生成一个歌曲列表下标数组之内的随机数
        if (reback === "random") {
          togo = Math.round(Math.random() * max);
        }
      }

      if (getSongsId?.length - 1 === 0 && key === "next") {
        musicRef.current.currentTime = 0;
        musicRef.current?.play();
      }

      dispatch(
        songsInfo({
          ...songsState,
          songId: getSongsId[togo],
          song: togo,
        })
      );
      localStorage.setItem("musicTime", "0");

      console.log("copyPlay", copyPlay);

      dispatch(changePlay({ play: copyPlay }));
    },
    // 未加依赖项 陷入闭包陷阱 要注意传入的props并非useCallback函数的直接函数参数
    // 因此必须指定依赖项
    [changePlay, songsInfo, prevornext, song, songsState, play]
  );
};
