import { useMutation, useQuery } from "react-query";
import { http, useHttp } from "utils";

// 二维码key生成
export const useQrKey = () => {
  const client = useHttp();
  return useQuery(["loginqrkey"], () =>
    client("login/qr/key", { data: { timerstamp: Date.now() } })
  );
};

// 二维码生成接口
export const useQrCreate = (key: string) => {
  const client = useHttp();
  return useQuery(["loginqrcreate"], () =>
    client("login/qr/create", {
      data: { key: key, qrimg: true, timerstamp: Date.now() },
    })
  );
};

// 登录状态
export const useLoginStatus = (cookie: string) => {
  const client = useHttp();
  return useQuery(["loginstatus"], () =>
    client(`login/status?timerstamp=${Date.now()}`, {
      data: { cookie },
      method: "POST",
    })
  );
};

// 二维码扫描检测
export const useQrCheck = () => {
  const client = useHttp();
  return useMutation((key: string) =>
    client("login/qr/check", {
      data: { key: key, timerstamp: Date.now() },
      method: "GET",
    })
  );

  //   return useQuery(["loginqrcheck"], () =>
  //     client("login/qr/check", {
  //       data: { key: key, timerstamp: Date.now() },
  //       method: "GET",
  //     })
  //   );
};

export const useGetQr = (key: string) => {
  const client = useHttp();
  return useQuery(["loginqrcheck"], () =>
    client("login/qr/check", {
      data: { key: key, qrimg: true, timerstamp: Date.now() },
    })
  );
};

export const qrCheck = (key: string) => {
  return http("login/qr/check", {
    data: { key: key, timerstamp: Date.now() },
    method: "GET",
  });
};
