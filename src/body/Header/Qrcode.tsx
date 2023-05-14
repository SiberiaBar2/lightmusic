import { useRef } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import { message } from "antd";
import stroe from "store";
import { loginSlice } from "store/login";

const Qrcode: React.FC = () => {
  const imgRef = useRef() as React.MutableRefObject<HTMLImageElement>;
  const userRef: React.MutableRefObject<any> = useRef();

  const { getUserInfo } = loginSlice.actions;
  const api = process.env.REACT_APP_API_URL;

  async function checkStatus(key: string) {
    const res = await axios({
      url: `${api}/login/qr/check?key=${key}&timerstamp=${Date.now()}`,
    });
    return res.data;
  }
  async function getLoginStatus(cookie = "") {
    const res = await axios({
      url: `${api}/login/status?timerstamp=${Date.now()}`,
      method: "post",
      data: {
        cookie,
      },
    });

    userRef.current = res.data;
    cookie && stroe.dispatch(getUserInfo({ data: res.data.data }));
  }
  async function login() {
    let timer: any;
    const cookie = localStorage.getItem("cookie");

    // 这里和存redux时 前面不&& 会引发无限循环 暂时不知原因
    cookie && getLoginStatus(cookie as string);
    const res = await axios({
      url: `${api}/login/qr/key?timerstamp=${Date.now()}`,
    });
    const key = res.data.data.unikey;
    const res2 = await axios({
      url: `${api}/login/qr/create?key=${key}&qrimg=true&timerstamp=${Date.now()}`,
    });

    if (imgRef.current) {
      imgRef.current.src = res2.data.data.qrimg;
    }

    // eslint-disable-next-line prefer-const
    timer = setInterval(async () => {
      const statusRes = await checkStatus(key);

      if (statusRes.code === 800) {
        message.warning("二维码已过期,请重新获取");
        clearInterval(timer);
      }
      if (statusRes.code === 803) {
        // 这一步会返回cookie
        clearInterval(timer);
        message.success("授权登录成功");
        await getLoginStatus(statusRes.cookie);
        localStorage.setItem("cookie", statusRes.cookie);
      }
    }, 3000);
  }

  login();

  return (
    <Content>
      <div>
        <span style={{ marginBottom: "2rem" }}>使用网易云app登录</span>
        <img color="red" id="#qrImg" ref={imgRef} alt="" />
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
