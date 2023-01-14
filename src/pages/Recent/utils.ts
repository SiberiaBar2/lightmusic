import { useQuery } from "react-query";
import { useHttp } from "utils";

// 最近播放
export const useRecent = () => {
  const client = useHttp();
  return useQuery(["recordrecentsong"], () => client("record/recent/song"));
};
