import { useCallback } from "react";
import * as qs from "qs";
// import * as auth from "auth-provider";
// import { useAuth } from "context/auth-context";

const api = process.env.REACT_APP_API_URL;

interface Config extends RequestInit {
  data?: object;
  token?: string;
}

export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config = {}
) => {
  console.log("ddddddd", data);

  const config = {
    method: "GET",
    headers: {
      //   Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    ...customConfig,
  };

  console.log("endpoint", endpoint);

  console.log("qs.stringify(data)", qs.stringify(data));

  if (config.method.toUpperCase() === "GET") {
    if (data) endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }

  console.log("sdssdsdsdsds", `${api}/${endpoint}`);

  return fetch(`${api}/${endpoint}`, config).then(async (response) => {
    // if (response.status === 401) {
    //     await auth.logout();
    //   window.location.reload();
    //   return Promise.reject({ message: "请重新登陆" });
    // }

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
};

export const useHttp = () => {
  //   const { user } = useAuth();
  return useCallback(
    (...[endpoint, config]: Parameters<typeof http>) =>
      http(endpoint, { ...config }),
    //   http(endpoint, { ...config, token: user?.token }),
    []
    // [user?.token]
  );
};
