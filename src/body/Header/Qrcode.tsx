import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message, QRCode } from "antd";
import styled from "@emotion/styled";
import _ from "lodash";

import stroe, { RootState } from "store";
import { loginSlice, LoginState } from "store/login";
import {
  useCheckLoginStatus,
  useGetLoginValue,
  useGetQrcodeUrl,
  useGetUniKey,
} from "./utils";

const Qrcode: React.FC = () => {
  const loginState = useSelector<
    RootState,
    Pick<LoginState, "data" | "islogin">
  >((state) => state.login);
  // const { changeLogin } = loginSlice.actions;

  const { data: { data: { profile = {} } = {} } = {}, islogin } = loginState;
  const timerRef = useRef(null) as React.MutableRefObject<any>;

  const navigate = useNavigate();
  const { getUserInfo, changeLogin } = loginSlice.actions;

  const [expired, setExpired] = useState(false);
  const { data: { unikey = "" } = {} } = useGetUniKey(expired);
  const { data: { qrimg = "" } = {} } = useGetQrcodeUrl(unikey);

  // 为什么 unikey 导致的会多次重渲染
  // console.log("unikey", unikey);

  const infoData = (data: any) => {
    console.log(
      "执行多少次",
      data,
      "!_.isEmpty(data.data)",
      !_.isEmpty(data.data)
    );

    if (data?.data && !_.isEmpty(data.data)) {
      stroe.dispatch(getUserInfo({ data: data.data }));
      stroe.dispatch(changeLogin({ islogin: true }));

      // setTimeout(() => {
      //   location.reload();
      // }, 1000);
    }
  };
  const { mutate: getUserInfoSync } = useGetLoginValue(infoData);

  const getData = (data: any) => {
    console.warn("check-status", data);
    if (data.code === 800) {
      message.warning("二维码已过期,请重新获取");
      clearInterval(timerRef.current);
      setExpired(true);
    }
    if (data.code === 803) {
      // 这一步会返回cookie
      clearInterval(timerRef.current);
      message.success("授权登录成功");
      getUserInfoSync(data.cookie);
      // 然而现在又是好的？？？
      localStorage.setItem("cookie", data.cookie);
      // localStorage 放在上面 导致接口调用时cookie不存在，登录失效？
      setTimeout(() => {
        navigate("/main/recommendsongsheet", {
          state: {
            userCookie: data.cookie,
          },
        });
      }, 500);
      // setTimeout(() => {
      //   location.reload();
      // }, 1000);
    }
  };
  const { mutate: check } = useCheckLoginStatus(getData);

  useEffect(() => {
    // if (timerRef.current) {
    //   clearInterval(timerRef.current);
    // }
    if (unikey && _.isEmpty(profile)) {
      timerRef.current = setInterval(() => {
        check(unikey);
      }, 3000);
    }

    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, [unikey, profile]);

  return (
    <Content>
      <div>
        <span style={{ marginBottom: "2rem", display: "inline-block" }}>
          使用网易云app登录
        </span>
        <div>
          {expired ? (
            <>
              <span>二维码已过期,请重新获取</span>
              <p
                onClick={() => {
                  setExpired(false);
                }}
              >
                点击刷新
              </p>
            </>
          ) : (
            // <QRCode value={qrimg}></QRCode>
            <img src={qrimg} alt="" />
          )}
        </div>
      </div>
    </Content>
  );
};

export default Qrcode;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    font-size: 1rem;
  }

  > div {
    width: 14rem;
    height: 14rem;
    text-align: center;

    img {
      width: 100%;
      height: 100%;
    }
  }
`;
