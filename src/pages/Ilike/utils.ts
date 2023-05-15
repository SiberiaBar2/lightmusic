import { useHttp } from "utils";
import { useQuery } from "react-query";

type IdType = number | string | null | undefined;
const cookie = localStorage.getItem("cookie");

// 歌曲详情
export const useSongDetail = (ids: IdType) => {
  const client = useHttp();
  console.log("idx----->", ids);

  return useQuery({
    queryKey: ["songdetaililike", ids],
    queryFn: () => client("song/detail", { data: { ids, cookie } }),
    enabled: !!ids,
  });
};
