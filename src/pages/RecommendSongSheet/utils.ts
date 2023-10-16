import { useHttp } from "utils";
import { useQuery } from "react-query";
export const cookie = localStorage.getItem("cookie");

export const useRecommend = () => {
  const client = useHttp();
  return useQuery({
    queryKey: "recommend",
    queryFn: () => client("personalized"),
  });
};

export const useRecommendResource = (userCookie?: string) => {
  console.log("cookie", cookie, "userCookie", userCookie);

  const client = useHttp();
  return useQuery({
    queryKey: "recommendresource",
    queryFn: () =>
      client("recommend/resource", { data: { cookie: cookie || userCookie } }),
  });
};

export const useBanner = () => {
  const client = useHttp();
  return useQuery({
    queryKey: "banner",
    queryFn: () => client("banner"),
  });
};

// 推荐歌曲
export const useRecommendSongs = () => {
  const client = useHttp();
  return useQuery({
    queryKey: "recommendsongs",
    queryFn: () =>
      client("recommend/songs", {
        data: { cookie },
      }),
  });
};
