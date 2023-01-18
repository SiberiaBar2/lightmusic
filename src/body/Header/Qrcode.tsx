import { useRef, forwardRef, useImperativeHandle } from "react";
import styled from "@emotion/styled";
import { login } from "./login";
import axios from "axios";
import { Avatar, message, Popover } from "antd";
import stroe from "store";
import { loginSlice } from "store/login";

const Qrcode = (props: any, ref: any) => {
  const imgRef: React.MutableRefObject<any> = useRef();
  const userRef: React.MutableRefObject<any> = useRef();

  const { getUserInfo } = loginSlice.actions;
  const api = process.env.REACT_APP_API_URL;

  // const getUserInfo = () => {
  //   return userRef;
  // };
  useImperativeHandle(ref, () => ({
    users: userRef,
  }));

  // const content = (
  //   <Content>
  //     <p>
  //       <img id="#qrImg" ref={imgRef} alt="" />
  //     </p>
  //     <p>Content</p>
  //   </Content>
  // );
  async function checkStatus(key: string) {
    console.log("checkStatus");
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

    console.log("userinfo res.data", res.data);
    userRef.current = res.data;
    console.log("userRef.current", userRef.current);
    cookie && stroe.dispatch(getUserInfo({ data: res.data.data }));
    //   document.querySelector("#info").innerText = JSON.stringify(res.data, null, 2);
  }
  async function login() {
    let timer: any;
    const timestamp = Date.now();
    const cookie = localStorage.getItem("cookie");
    console.log("cookie ------> cookie", cookie);

    // 这里和存redux时 前面不&& 会引发无限循环 暂时不知原因
    cookie && getLoginStatus(cookie as string);
    const res = await axios({
      url: `${api}/login/qr/key?timerstamp=${Date.now()}`,
    });
    const key = res.data.data.unikey;
    const res2 = await axios({
      url: `${api}/login/qr/create?key=${key}&qrimg=true&timerstamp=${Date.now()}`,
    });

    //   console.log("ref.currtet.src", ref.current);
    console.log(
      'document.querySelector("#qrImg")',
      document.querySelector("#qrImg")
    );

    console.log("imgRef", imgRef);
    if (imgRef.current) {
      imgRef.current.src = res2.data.data.qrimg;
    }

    console.log("cookie", cookie);

    // eslint-disable-next-line prefer-const
    timer = setInterval(async () => {
      const statusRes = await checkStatus(key);
      console.log("statusRes", statusRes);

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
        <span>请使用网易云app扫码登录</span>
        <img id="#qrImg" ref={imgRef} alt="" />
      </div>
      <p>Content</p>
    </Content>
  );
};

const Content = styled.div`
  width: 18rem;
  height: 18rem;
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    width: 12rem;
    height: 12rem;
    text-align: center;

    img {
      width: 100%;
      height: 100%;
    }
  }
`;

export default forwardRef(Qrcode);
