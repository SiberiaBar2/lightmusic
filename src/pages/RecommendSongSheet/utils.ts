import { useHttp } from "utils";
import { useQuery } from "react-query";
import { useQuery as useQueryC } from "@karlfranz/reacthooks";

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
  return useQueryC<Recommend, null>(() => client("personalized"));
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
  return useQueryC<
    {
      banners: { imageUrl: string; encodeId: string }[];
    },
    null
  >(() => client("banner"));
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
