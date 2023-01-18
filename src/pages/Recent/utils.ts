import { useQuery } from "react-query";
import { useHttp } from "utils";
const cookie = localStorage.getItem("cookie");

// 最近播放
export const useRecent = () => {
  const client = useHttp();
  return useQuery(["recordrecentsong"], () =>
    client("record/recent/song", { data: { cookie } })
  );
};
