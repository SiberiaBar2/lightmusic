import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { message } from "antd";
import stroe, { RootState } from "store";
import { loginSlice } from "store/login";
import {
  useCheckLoginStatus,
  useGetLoginValue,
  useGetQrcodeUrl,
  useGetUniKey,
} from "./utils";
import _ from "lodash";
import { useSelector } from "react-redux";
import { LoginState } from "store/login";

const Qrcode: React.FC = () => {
  const loginState = useSelector<
    RootState,
    Pick<LoginState, "data" | "islogin">
  >((state) => state.login);
  // const { changeLogin } = loginSlice.actions;

  // 解构赋值 真正的默认值
  const { data: { data: { profile = {} } = {} } = {}, islogin } = loginState;
  const timerRef = useRef(null) as React.MutableRefObject<any>;

  const navigate = useNavigate();
  const { getUserInfo, changeLogin } = loginSlice.actions;

  const { data: { unikey = "" } = {} } = useGetUniKey();
  const { data: { qrimg = "" } = {} } = useGetQrcodeUrl(unikey);

  // 为什么 unikey 导致的会多次重渲染
  console.log("unikey", unikey);

  const infoData = (data: any) => {
    console.log(
      "执行多少次",
      data,
      "!_.isEmpty(data.data)",
      !_.isEmpty(data.data)
    );

    if (!_.isEmpty(data.data)) {
      stroe.dispatch(getUserInfo({ data: data.data }));
      stroe.dispatch(changeLogin({ islogin: true }));
    }
  };
  const { mutate: getUserInfoSync } = useGetLoginValue(infoData);

  const getData = (data: any) => {
    console.warn("check-status", data);
    if (data.code === 800) {
      message.warning("二维码已过期,请重新获取");
      // clearInterval(timerRef.current);
    }
    if (data.code === 803) {
      // 这一步会返回cookie
      clearInterval(timerRef.current);
      message.success("授权登录成功");
      getUserInfoSync(data.cookie);
      // 然而现在又是好的？？？
      // localStorage.setItem("cookie", data.cookie);
      // localStorage 放在上面 导致接口调用时cookie不存在，登录失效？
      setTimeout(() => {
        localStorage.setItem("cookie", data.cookie);
        navigate("/main/recommendsongsheet");
      }, 500);
    }
  };
  const { mutate: check } = useCheckLoginStatus(getData);

  useEffect(() => {
    // if (timerRef.current) {
    //   clearInterval(timerRef.current);
    // }
    if (unikey && !islogin) {
      timerRef.current = setInterval(() => {
        check(unikey);
      }, 3000);
    }

    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, [unikey, islogin]);

  return (
    <Content>
      <div>
        <span style={{ marginBottom: "2rem", display: "inline-block" }}>
          使用网易云app登录
        </span>
        <img color="red" src={qrimg} alt="" />
      </div>
    </Content>
  );
};

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

export default Qrcode;
