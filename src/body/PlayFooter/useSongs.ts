import {
  useSongComment,
  useSongDetail,
  useSonglyric,
  useSongsimi,
  useSongUrl,
} from "./utils";
import { PLAYCONSTANTS, COMMENT } from "./contants";
import { useEffect, useState } from "react";
import { message } from "antd";

const getDura = (dt: number) => {
  const totalSeconds = Math.floor(dt / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (isNaN(minutes) || isNaN(seconds)) {
    return "00:00";
  }
  const m = minutes < 10 ? "0" + minutes : minutes;
  const s = seconds < 10 ? "0" + seconds : seconds;
  return m + ":" + s;
};
export const useSongs = (
  songId: number | string,
  toneQuality: string,
  goPrevorNext?: (key: string, reback?: string) => void
) => {
  // 这里的if 会导致react hook数组发生变化 引发bug！经验证确认！
  // Uncaught TypeError: Cannot read properties of undefined (reading 'length')
  // Warning: React has detected a change in the order of Hooks called by PlayFooter. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks

  // if (!songId)
  //   return {
  //     data: [],
  //     name: "",
  //     picUrl: "",
  //     authName: "",
  //     lyric: "",
  //     songs: [],
  //     comments: [],
  //     userId: 0,
  //     topComments: [],
  //   };
  const res = useSongUrl(songId, toneQuality);
  const { data: { data = [{ url: "" }] } = {} } = res;
  // const res = useSongUrl(songId, toneQuality);
  if (data?.[0]?.fee === 0) {
    // 直接播放下一曲
    goPrevorNext && goPrevorNext("next");
  }
  console.log("res==>", res);

  const {
    data: {
      songs: [
        {
          al: { name, picUrl },
          ar: [{ name: authName }],
          dt,
        },
      ],
    } = PLAYCONSTANTS,
  } = useSongDetail(songId);
  const { data: dataDetail } = useSongDetail(songId);

  console.log("dataDetail", dataDetail);
  const { data: { lrc: { lyric } } = { lrc: { lyric: "" } } } =
    useSonglyric(songId);

  const { data: { songs } = { songs: [] } } = useSongsimi(songId);

  const { data: { hotComments, comments, userId, topComments } = COMMENT } =
    useSongComment(songId);

  return {
    data,
    name,
    picUrl,
    authName,
    lyric,
    songs,
    hotComments,
    comments,
    userId,
    topComments,
    dt,
    // dt: getDura(dt),
  };
};
