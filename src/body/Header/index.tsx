import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Left, Right, Search, Refresh } from "@icon-park/react";
import { Avatar, Button, Input, Tooltip } from "antd";
import styled from "@emotion/styled";
import _ from "lodash";
import { HotList } from "./HotList";
import stroe, { RootState } from "store";
import { loginSlice, LoginState } from "store/login";
import { stringAdds } from "utils/utils";
import { useYiyan } from "./utils";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const loginState = useSelector<
    RootState,
    Pick<LoginState, "data" | "islogin">
  >((state) => state.login);
  // const { changeLogin } = loginSlice.actions;

  const { getUserInfo, changeLogin } = loginSlice.actions;
  // 解构赋值 真正的默认值
  const { data: { data: { profile = {} } = {} } = {}, islogin } = loginState;

  console.log("profile", profile);

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
    if (!profile && _.isEmpty(profile)) {
      stroe.dispatch(getUserInfo({ data: {} }));
      stroe.dispatch(changeLogin({ islogin: false }));
    }
  }, [profile]);
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
        {_.isEmpty(profile) ? (
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

            {/* <Tooltip title={profile.nickname}> */}
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
            {/* </Tooltip> */}
          </>
        )}
      </Users>
    </User>
  );

  const renderRightContent = () => (
    <RightContent>
      <IconWrap>
        <Left
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
        />
      </IconWrap>
      <Zhixue onClick={changeZhixue}>🎉</Zhixue>
      {renderUser()}
    </RightContent>
  );

  return (
    <Container>
      <H4 onClick={() => navigate("main/recommendsongsheet")}>lightmusic</H4>
      {renderRightContent()}
      {!search && (
        <SearchContent style={{ display: open ? "" : "none" }}>
          {/* {!search ? ( */}
          <HotList handelBlue={() => setOpen(false)} />
          {/* ) :  */}
          {/* // <Suggest param={debouncedParam} />
          // null} */}
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
  text-align: center;
  position: relative;
  cursor: pointer;

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
  width: 37rem;
  height: 5.5rem;
  overflow: hidden;
  /* line-height: 5.5rem; */
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid red; */
`;
