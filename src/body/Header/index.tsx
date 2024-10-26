import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar, Button, Input, Tooltip } from "antd";
import { Left, Right, Search, Refresh } from "@icon-park/react";
import styled from "@emotion/styled";
import _ from "lodash";

import { HotList } from "./HotList";
import stroe, { RootState } from "store";
import { loginSlice, LoginState } from "store/login";
import { stringAdds } from "utils/utils";
import { useLogin, useYiyan } from "./utils";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const loginState = useSelector<
    RootState,
    Pick<LoginState, "data" | "islogin">
  >((state) => state.login);

  const loginStatus = useLogin();
  const { getUserInfo, changeLogin } = loginSlice.actions;
  const { data: { data: { profile = {} } = {} } = {}, islogin } = loginState;

  const [reset, setReset] = useState(false);
  const { data: text } = useYiyan(reset);

  const navigate = useNavigate();

  const changeZhixue = () => {
    localStorage.getItem("zhixue") === "false"
      ? localStorage.setItem("zhixue", "true")
      : localStorage.setItem("zhixue", "false");
  };

  // 解除登录态
  useEffect(() => {
    if (!loginStatus) {
      stroe.dispatch(getUserInfo({ data: {} }));
      // stroe.dispatch(changeLogin({ islogin: false }));
    }
  }, [loginStatus]);
  // const { data: { data: { unikey } } = { data: { unikey: "" } } } = useQrKey();
  // // console.log("loginKey", unikey);

  // const { data: { data: { qrimg } } = { data: { qrimg: "" } } } =
  //   useQrCreate(unikey);
  // console.log("create", qrimg);

  // const cookie = localStorage.getItem("cookie");
  // const { data: userInfo } = useLoginStatus(cookie as string);
  // console.log("userInfo", userInfo);

  // const func = (key: string) => {
  // const { mutate, data } = useQrCheck();
  // const { data } = useGetQr(unikey);
  // console.log("获得", data);
  //   console.log("mus", data);
  //   // mutate(key);
  // };
  // 这里 mutate 拿不到扫码后的值 即使你扫码了
  // useInterVal(
  //   () => {
  //     mutate(unikey);
  //     // const { data } = useGetQr(unikey);
  //     console.log("datadata", data);
  //     if (data?.code === 800) {
  //       setStop(true);
  //       message.error("二维码已过期，请重新获取");
  //     }
  //     if (data?.code === 803) {
  //       setStop(true);
  //       message.success("授权登录成功");
  //     }
  //   },
  //   !stop ? 3000 : null
  // );

  // 会引发无限请求
  // eslint-disable-next-line prefer-const
  // timer = setInterval(() => {
  //   console.log("datadata", data);
  //   if (data?.code === 800) {
  //     clearInterval(timer);
  //     message.error("二维码已过期，请重新获取");
  //   }
  //   if (data?.code === 803) {
  //     clearInterval(timer);
  //     message.success("授权登录成功");
  //   }
  // }, 3000);

  const searchIcon = () => {
    return (
      <Search
        onClick={() => {
          search && navigate(`main/search/${search}`);
          setOpen(false);
        }}
        theme="outline"
        size="18"
        fill="rgb(62, 56, 65)"
      />
    );
  };

  const renderUser = () => (
    <User>
      <Tooltip title={text}>
        <Yiyan>
          {text ? (
            <>
              <span
                style={{
                  marginRight: 3,
                }}
              >
                {text}
              </span>
              <Refresh
                style={{ cursor: "pointer" }}
                theme="outline"
                size="18"
                fill="rgb(249, 241, 219)"
                onClick={() => setReset(!reset)}
              />
            </>
          ) : null}
        </Yiyan>
      </Tooltip>
      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        addonAfter={searchIcon()}
        placeholder="搜索"
        style={{ width: "25%", marginRight: "2rem" }}
        onBlur={() => setTimeout(() => setOpen(false), 1000)}
        onFocus={() => setOpen(true)}
        onPressEnter={(e) => {
          if (e.key === "Enter") {
            search && navigate(`main/search/${search}`);
            setOpen(false);
          }
        }}
      />
      <Users>
        {!loginStatus ? (
          <Button
            style={{
              fontSize: "0.9rem",
              cursor: "pointer",
              borderRadius: "5rem",
              background: "rgba(0, 0, 0, 0.1)",
            }}
            type="dashed"
            onClick={() => {
              navigate("login/unlogin");
            }}
          >
            请登录
          </Button>
        ) : (
          <>
            <Avatar
              style={{
                verticalAlign: "middle",
                cursor: "pointer",
              }}
              size="large"
              icon={
                <img
                  src={!_.isEmpty(profile) ? stringAdds(profile.avatarUrl) : ""}
                />
              }
              onClick={() => {
                navigate("login/1");
              }}
            />

            <span
              title={profile.nickname}
              style={{
                margin: "0 0.5rem",
                fontSize: "0.8rem",
                lineHeight: "100%",
                color: "rgb(62, 56, 65)",
              }}
            >
              {!_.isEmpty(profile) ? profile.nickname : null}
            </span>
          </>
        )}
      </Users>
    </User>
  );

  const renderRightContent = () => (
    <RightContent>
      <IconWrap>
        {/* <Left
          theme="outline"
          size="24"
          fill="rgb(251, 236, 222)"
          onClick={() => window.history.back()}
        />
        <Right
          theme="outline"
          size="24"
          fill="rgb(251, 236, 222)"
          onClick={() => window.history.forward()}
        /> */}
      </IconWrap>
      {/* <Zhixue onClick={changeZhixue}>🎉</Zhixue> */}
      <svg
        fill="#000000"
        width="20px"
        height="20px"
        viewBox="0 0 0.6 0.6"
        xmlns="http://www.w3.org/2000/svg"
        data-name="Layer 1"
        style={{
          cursor: "pointer",
        }}
        onClick={() => window.open("https://github.com/SiberiaBar2")}
      >
        {/* eslint-disable-next-line max-len */}
        <path d="M0.3 0.056a0.25 0.25 0 0 0 -0.079 0.487c0.013 0.002 0.017 -0.005 0.017 -0.012 0 -0.006 0 -0.026 0 -0.047 -0.063 0.012 -0.079 -0.015 -0.084 -0.029a0.091 0.091 0 0 0 -0.026 -0.035c-0.009 -0.005 -0.021 -0.016 0 -0.017a0.05 0.05 0 0 1 0.038 0.026 0.053 0.053 0 0 0 0.073 0.021 0.053 0.053 0 0 1 0.016 -0.033c-0.056 -0.006 -0.114 -0.028 -0.114 -0.123a0.098 0.098 0 0 1 0.026 -0.067 0.09 0.09 0 0 1 0.003 -0.066s0.021 -0.007 0.069 0.026a0.236 0.236 0 0 1 0.125 0c0.048 -0.033 0.069 -0.026 0.069 -0.026a0.09 0.09 0 0 1 0.003 0.066 0.097 0.097 0 0 1 0.026 0.067c0 0.096 -0.058 0.117 -0.114 0.123a0.059 0.059 0 0 1 0.017 0.046c0 0.033 0 0.06 0 0.069 0 0.007 0.005 0.014 0.017 0.012A0.25 0.25 0 0 0 0.3 0.056" />
      </svg>
      {renderUser()}
    </RightContent>
  );

  return (
    <Container>
      <H4 onClick={() => navigate("main/recommendsongsheet")}>lightmusic</H4>
      {renderRightContent()}
      {!search && (
        <SearchContent style={{ display: open ? "" : "none" }}>
          <HotList handelBlue={() => setOpen(false)} />
        </SearchContent>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const H4 = styled.h2`
  margin: 0;
  width: 19%;
  height: 100%;
  line-height: 4.75rem;
  text-align: left;
  position: relative;
  cursor: pointer;
  padding-left: 2.5rem;

  > span {
    font-size: 0.1rem;
  }
`;

const RightContent = styled.div`
  width: calc(100% - 19%);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const User = styled.div`
  width: calc(100% - 40%);
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const SearchContent = styled.div`
  width: 21rem;
  height: 35rem;
  background: rgba(0, 0, 0, 0.4);

  position: absolute;
  top: 5rem;
  right: 11rem;
  z-index: 20;
  overflow-y: auto;
  border-radius: 1rem;
  transition: 0.6s;
`;

const IconWrap = styled.div`
  width: 10%;

  span {
    margin: 0 0.5rem;
    cursor: pointer;
  }
`;

const Users = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 1rem;
`;

const Zhixue = styled.div`
  cursor: pointer;
  > span {
    margin-right: 1rem;
  }
`;

const Yiyan = styled.div`
  margin-right: 1rem;
  height: 5.5rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;
