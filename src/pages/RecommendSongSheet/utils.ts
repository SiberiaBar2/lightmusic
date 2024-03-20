import { useHttp } from "utils";
import { useQuery } from "react-query";
import { useRequest } from "react-custom-hook-karlfranz";

export const cookie = localStorage.getItem("cookie");

interface Recommend {
  result: {
    alg: string;
    canDislike: boolean;
    copywriter: string;
    highQuality: boolean;
    id: number;
    name: string;
    picUrl: string;
    playCount: number;
    trackCount: number;
    trackNumberUpdateTime: number;
    type: number;
  }[];
}

export const useRecommend = () => {
  const client = useHttp();
  return useRequest<Recommend>(() => client("personalized"));

  // return useQuery({
  //   queryKey: "recommend",
  //   queryFn: () => client("personalized"),
  // });
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
  return useRequest<{
    banners: { imageUrl: string; encodeId: string }[];
  }>(() => client("banner"));
  // return useQuery({
  //   queryKey: "banner",
  //   queryFn: () => client("banner"),
  // });
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
