import { useHttp } from "utils";
import { useMutation, useQuery } from "react-query";

type IdType = number | string | null | undefined;
const cookie = localStorage.getItem("cookie");

// 播放地址
export const useSongUrl = (id: IdType, level: string) => {
  const client = useHttp();
  return useQuery({
    queryKey: ["songurl", id, level],
    queryFn: () => client("song/url/v1", { data: { id, cookie, level } }),
    enabled: !!id, // 惰性请求 只有参数不为 undefined 、 null 、 ''时发起请求
  });
};

// 歌曲详情
export const useSongDetail = (ids: IdType) => {
  const client = useHttp();
  return useQuery({
    queryKey: ["songdetail", ids],
    queryFn: () => client("song/detail", { data: { ids } }),
    enabled: !!ids,
  });
};

// 歌词
export const useSonglyric = (id: IdType) => {
  const client = useHttp();
  return useQuery({
    queryKey: ["lyric", id],
    queryFn: () => client("lyric", { data: { id } }),
    enabled: !!id,
  });
};

// 评论
export const useSongComment = (id: IdType) => {
  const client = useHttp();
  return useQuery({
    queryKey: ["comment/music", id],
    queryFn: () => client("comment/music", { data: { id } }),
    enabled: !!id,
  });
};

// 相似歌曲
export const useSongsimi = (id: IdType) => {
  const client = useHttp();
  return useQuery({
    queryKey: ["simi/song", id],
    queryFn: () => client("simi/song", { data: { id } }),
    enabled: !!id,
  });
};

// 检测歌曲是否可用
export const useCheckMusic = () => {
  const client = useHttp();
  return (id: IdType) =>
    useQuery({
      queryKey: ["checkmusic", id],
      queryFn: () => client("check/music", { data: { id, cookie } }),
      enabled: !!id,
    });
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

// 推荐新歌曲
export const useNewSongs = () => {
  const client = useHttp();
  return useQuery({
    queryKey: ["personalizednewsong"],
    queryFn: () => client("personalized/newsong"),
  });
};
