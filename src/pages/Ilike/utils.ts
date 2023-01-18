import { useHttp } from "utils";
import { useMutation, useQuery } from "react-query";

type IdType = number | string | null | undefined;
const cookie = localStorage.getItem("cookie");

// 歌曲详情
export const useSongDetail = (ids: IdType) => {
  const client = useHttp();
  return useQuery(["songdetail", ids], () =>
    client("song/detail", { data: { ids: ids, cookie } })
  );
};
