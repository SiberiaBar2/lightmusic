import {
  useSongComment,
  useSongDetail,
  useSonglyric,
  useSongsimi,
  useSongUrl,
} from "./utils";
import { PLAYCONSTANTS, COMMENT } from "./contants";

export const useSongs = (songId?: number) => {
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
  const { data: { data = [{ url: "" }] } = {} } = useSongUrl(songId);
  const {
    data: {
      songs: [
        {
          al: { name, picUrl },
          ar: [{ name: authName }],
        },
      ],
    } = PLAYCONSTANTS,
  } = useSongDetail(songId);

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
  };
};
