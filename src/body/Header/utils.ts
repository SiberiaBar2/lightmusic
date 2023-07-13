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

export const useYiyan = (reset: boolean) => {
  return useQuery(["yiyan", reset], () =>
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

// 二维码相关
export const useCheckLoginStatus = (callBack?: (value: unknown) => void) => {
  const client = useHttp();
  return useMutation(
    (key: string) =>
      client(`login/qr/check`, {
        method: "GET",
        data: {
          key: key,
          timerstamp: Date.now(),
        },
      }),
    {
      onSuccess: callBack,
    }
  );
};

export const useGetLoginValue = (callBack?: (value: unknown) => void) => {
  const client = useHttp();
  return useMutation(
    (cookie: string) =>
      client(`login/status`, {
        method: "POST",
        data: {
          timerstamp: Date.now(),
          cookie,
        },
      }),
    {
      onSuccess: callBack,
    }
  );
};

export const useGetUniKey = () => {
  const client = useHttp();
  return useQuery(
    ["unikey"],
    () =>
      client("login/qr/key", {
        data: {
          timerstamp: Date.now(),
        },
      }),
    {
      select: (res) => ({ unikey: res?.data?.unikey }),
    }
  );
};

export const useGetQrcodeUrl = (key?: string) => {
  const client = useHttp();
  return useQuery(
    ["qrimg"],
    () =>
      client("login/qr/create", {
        data: {
          key: key,
          qrimg: true,
          timerstamp: Date.now(),
        },
      }),
    {
      enabled: !!key,
      select: (res) => ({ qrimg: res?.data?.qrimg }),
    }
  );
};
