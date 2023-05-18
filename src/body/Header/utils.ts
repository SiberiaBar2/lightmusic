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

export const useLogout = () => {
  const client = useHttp();
  return useMutation(() =>
    client("logout", {
      method: "GET",
    })
  );
};

export const useYiyan = () => {
  return useQuery(["yiyan"], () =>
    fetch("https://v1.hitokoto.cn/")
      .then((response) => response.json())
      .then((data) => {
        return data.hitokoto;
      })
      .catch(console.error)
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
