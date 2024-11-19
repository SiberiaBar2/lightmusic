import {
  useSongComment,
  useSongDetail,
  useSonglyric,
  useSongsimi,
  useSongUrl,
} from "./utils";
import { PLAYCONSTANTS, COMMENT } from "./contants";

export const useSongs = (
  songId: number | string,
  toneQuality: string,
  goPrevorNext?: (key: string, reback?: string) => void
) => {
  // const res = useSongUrl(songId, toneQuality);
  // const { data: { data = [{ url: "" }] } = {} } = res;
  // if (data?.[0]?.fee === 0) {
  //   // 直接播放下一曲
  //   goPrevorNext && goPrevorNext("next");
  // }
  // console.log("res==>", res);

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
    // data,
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
