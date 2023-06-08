import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { message } from "antd";
import stroe from "store";
import { loginSlice } from "store/login";
import {
  useCheckLoginStatus,
  useGetLoginValue,
  useGetQrcodeUrl,
  useGetUniKey,
} from "./utils";

const Qrcode: React.FC = () => {
  const timerRef = useRef(null) as React.MutableRefObject<any>;

  const navigate = useNavigate();
  const { getUserInfo } = loginSlice.actions;

  const { data: { unikey = "" } = {} } = useGetUniKey();
  const { data: { qrimg = "" } = {} } = useGetQrcodeUrl(unikey);

  // 为什么 unikey 导致的会多次重渲染
  console.log("unikey", unikey);

  const infoData = (data: any) => {
    stroe.dispatch(getUserInfo({ data: data.data }));
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
      localStorage.setItem("cookie", data.cookie);
      setTimeout(() => {
        navigate("/main/recommendsongsheet");
      }, 500);
    }
  };
  const { mutate: check } = useCheckLoginStatus(getData);

  useEffect(() => {
    // if (timerRef.current) {
    //   clearInterval(timerRef.current);
    // }
    timerRef.current = setInterval(() => {
      unikey && check(unikey);
    }, 3000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [unikey]);

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
