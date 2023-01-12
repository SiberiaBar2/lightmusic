import { useHttp } from "utils";
import { useQuery } from "react-query";

export const useRankingSongs = (id: number | string) => {
  const client = useHttp();
  return useQuery(["playlistdetail", id], () =>
    client("playlist/detail", { data: { id } })
  );
};
