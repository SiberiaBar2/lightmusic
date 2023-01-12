import { useHttp } from "utils";
import { useQuery } from "react-query";

type IdType = number | string | null | undefined;

// 播放地址
export const useSongUrl = (id: IdType) => {
  const client = useHttp();
  return useQuery(["songurl", id], () => client("song/url", { data: { id } }));
};

// 歌曲详情
export const useSongDetail = (ids: IdType) => {
  const client = useHttp();
  return useQuery(["songdetail", ids], () =>
    client("song/detail", { data: { ids } })
  );
};

// 歌词
export const useSonglyric = (id: IdType) => {
  const client = useHttp();
  return useQuery(["lyric", id], () => client("lyric", { data: { id } }));
};

// 评论
export const useSongComment = (id: IdType) => {
  const client = useHttp();
  return useQuery(["comment/music", id], () =>
    client("comment/music", { data: { id } })
  );
};
