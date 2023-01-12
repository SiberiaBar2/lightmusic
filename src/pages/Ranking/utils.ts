import { useHttp } from "utils";
import { useQuery } from "react-query";

export const useRanking = () => {
  const client = useHttp();
  return useQuery("toplist", () => client("toplist"));
};
