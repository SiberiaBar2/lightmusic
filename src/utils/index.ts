import { useCallback } from "react";
import * as qs from "qs";
import stroe from "store";
import { loginSlice } from "store/login";
// import * as auth from "auth-provider";
// import { useAuth } from "context/auth-context";

const api = process.env.REACT_APP_API_URL;
const { getUserInfo } = loginSlice.actions;

interface Config extends RequestInit {
  data?: object;
  token?: string;
}

export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config = {}
) => {
  // console.log("ddddddd", data);

  const config = {
    method: "GET",
    headers: {
      //   Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    ...customConfig,
    // credentials: "include",
  };

  // console.log("endpoint", endpoint);

  // console.log("qs.stringify(data)", qs.stringify(data), "data", data);

  if (config.method.toUpperCase() === "GET") {
    if (data) endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }

  return fetch(`${api}/${endpoint}`, config).then(async (response) => {
    // console.log(
    //   "response",
    //   response,
    //   "${api}/${endpoint}",
    //   `${api}/${endpoint}`
    // );
    if (response.status === 301) {
      localStorage.removeItem("cookie");
      stroe.dispatch(getUserInfo({ data: {} }));
      // window.location.reload();
      return Promise.reject({ message: "请重新登陆" });
    }

    console.log("response.status", response.status);

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
