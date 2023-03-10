import { useHttp } from "utils";
import { useQuery } from "react-query";
export const cookie = localStorage.getItem("cookie");

export const useRecommend = () => {
  const client = useHttp();
  return useQuery("recommend", () => client("personalized"));
};

export const useRecommendResource = () => {
  const client = useHttp();
  return useQuery("recommendresource", () =>
    client("recommend/resource", { data: { cookie } })
  );
};

export const useBanner = () => {
  const client = useHttp();
  return useQuery("banner", () => client("banner"));
};

// 每日推荐歌曲
export const useRecommendSongs = () => {
  const client = useHttp();
  return useQuery("recommendsongs", () =>
    client("recommend/songs", { data: { cookie } })
  );
};
