import { now } from "lodash";
import { useMutation, useQuery } from "react-query";
import { http, useHttp } from "utils";

// 获取用户详情
export const useUserDetail = (uid: number) => {
  const client = useHttp();
  return useQuery(["userdetail"], () =>
    client("user/detail", { data: { uid: uid } })
  );
};

// 我喜欢接口必须传入cookie验证登录状态
export const useIlike = (uid: number) => {
  const cookie = localStorage.getItem("cookie");
  const client = useHttp();
  return useQuery({
    queryKey: ["likelist", uid],
    queryFn: () =>
      client("likelist", { data: { uid: uid, cookie, timestemp: Date.now() } }),
    enabled: !!uid,
  });
};

// 刷新登陆
export const useRefreshLogin = () => {
  const cookie = localStorage.getItem("cookie");
  const client = useHttp();
  return useQuery(["loginrefresh"], () =>
    client("login/refresh", {
      data: { timerstamp: Date.now() },
    })
  );
};
