import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
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

export const useGetUniKey = (expired: boolean) => {
  const client = useHttp();
  return useQuery(
    ["unikey", expired],
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
    ["qrimg", key],
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

import { LoginState } from "store/login";
import { RootState } from "store";
import _ from "lodash";
export const useLogin = () => {
  const loginState = useSelector<
    RootState,
    Pick<LoginState, "data" | "islogin">
  >((state) => state.login);
  const { data: { data: { profile = {} } = {} } = {} } = loginState;
  console.log("profile", profile);

  return _.isEmpty(profile) ? false : true;
};
