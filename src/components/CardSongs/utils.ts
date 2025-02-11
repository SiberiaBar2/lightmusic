import { useHttp } from "utils";
import { useQuery } from "@karlfranz/reacthooks";

export const useRankingSongs = (id: number | string) => {
  const client = useHttp();
  const { data, loading } = useQuery(
    () => client("playlist/detail", { data: { id } }),
    {
      success(res) {
        console.log("返回", res);
      },
      refreshDeps: [id],
    }
  );

  return { data, isLoading: loading };
};
