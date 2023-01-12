import { useHttp } from "utils";
import { useQuery } from "react-query";

export const useRecommend = () => {
  const client = useHttp();
  return useQuery("recommend", () => client("personalized"));
};

export const useBanner = () => {
  const client = useHttp();
  return useQuery("banner", () => client("banner"));
};
