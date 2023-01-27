import { useHttp } from "utils";
import { useMutation, useQuery } from "react-query";

type IdType = number | string | null | undefined;
const cookie = localStorage.getItem("cookie");

// 播放地址
export const useSongUrl = (id: IdType) => {
  const client = useHttp();
  return useQuery(["songurl", id], () =>
    client("song/url", { data: { id, cookie } })
  );
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

// 相似歌曲
export const useSongsimi = (id: IdType) => {
  const client = useHttp();
  return useQuery(["simi/song", id], () =>
    client("simi/song", { data: { id } })
  );
};

// 检测歌曲是否可用
export const useCheckMusic = () => {
  const client = useHttp();
  return (id: IdType) =>
    useQuery(["checkmusic", id], () =>
      client("check/music", { data: { id, cookie } })
    );
};

export const useCheckMusictwo = () => {
  const client = useHttp();
  return useMutation((param: { id: number }) =>
    client("check/music", {
      method: "GET",
      data: param,
    })
  );
};

// 喜欢歌曲
export const useLike = () => {
  const client = useHttp();
  return useMutation(
    (param: {
      id: IdType;
      cookie: string;
      like?: boolean;
      timerstamp: number;
    }) =>
      client("like", {
        method: "GET",
        data: param,
      })
  );
};
