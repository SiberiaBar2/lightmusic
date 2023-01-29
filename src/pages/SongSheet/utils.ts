import { useQuery } from "react-query";
import { useHttp } from "utils";

const cookie = localStorage.getItem("cookie");

export const useUserPlayList = (uid: number) => {
  const client = useHttp();
  return useQuery(["userplaylist"], () =>
    client("user/playlist", { data: { uid: uid, cookie } })
  );
};
