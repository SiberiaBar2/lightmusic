import { useInterVal } from "hooks";
import { useLoginStatus, useQrCheck, useQrCreate, useQrKey } from "login";
import { useState } from "react";

export const useLogin = () => {
  const [stop, setStop] = useState(false);
  const { data: { data: { unikey } } = { data: { unikey: "" } } } = useQrKey();

  const { data: { data: { qrimg } } = { data: { qrimg: "" } } } =
    useQrCreate(unikey);

  const cookie = localStorage.getItem("cookie");
  const { data: userInfo } = useLoginStatus(cookie as string);

  const { mutate, data: statusRes } = useQrCheck();

  console.log("statusRes", statusRes);

  useInterVal(
    async () => {
      mutate(unikey);
      console.log("11111", statusRes);

      if (statusRes?.code === 800) {
        console.error("二维码已过期,请重新获取");
        setStop(true);
        //   clearInterval(timer);
      }
      if (statusRes?.code === 803) {
        // 这一步会返回cookie
        //   clearInterval(timer);
        console.error("授权登录成功");
        setStop(true);
        useLoginStatus(statusRes.cookie);
        localStorage.setItem("cookie", statusRes.cookie);
      }
    },
    !stop ? 1000 : null
  );
};
