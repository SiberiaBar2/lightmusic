import { useHttp } from "utils";
import { useQuery, useMutation } from "react-query";

export const useSongList = (data: any) => {
  const client = useHttp();
  return useQuery("playlistdetail", () => client("playlist/detail", data));
};
