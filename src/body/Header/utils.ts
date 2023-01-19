import { useMutation, useQuery } from "react-query";
import { useHttp } from "utils";

// 热搜榜
// querykey中间不能加/
export const useHotList = () => {
  const client = useHttp();
  return useQuery(["searchhotdetail"], () => client("search/hot/detail"));
};

// 搜索建议
export const useSuggest = (keywords: string) => {
  const client = useHttp();
  return useQuery(["searchsuggest", keywords], () =>
    client("search/suggest", { data: { keywords } })
  );
};

// 搜索结果
export const useCloudsearch = ({
  keywords,
  limit,
  offset,
}: {
  keywords: string;
  limit?: number;
  offset?: number;
}) => {
  const client = useHttp();
  return useQuery(["cloudsearch", keywords], () =>
    client("cloudsearch", {
      data: { keywords, limit, offset, timerstamp: Date.now() },
    })
  );
};
