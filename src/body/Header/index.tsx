import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Left, Right } from "@icon-park/react";
import { Avatar, Button, Input, message, Popover, Tooltip } from "antd";
import styled from "@emotion/styled";
import _ from "lodash";
import { HotList } from "./HotList";
// import { Suggest } from "./Suggest";
import Qrcode from "./Qrcode";
import { RootState } from "store";
import { LoginState } from "store/login";
import { UserDetail } from "./UserDetail";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const loginState = useSelector<RootState, Pick<LoginState, "data">>(
    (state) => state.login
  );

  // 解构赋值 真正的默认值
  const { data: { data: { profile = {} } = {} } = {} } = loginState;

  // console.log("loginState", loginState, "data。", profile);

  // const debouncedParam = useDebounce(search, 500);

  const navigate = useNavigate();

  const handelBlue = () => {
    setOpen(!open);
  };

  const handelEnter = (e: any) => {
    if (e.key === "Enter") {
      search && navigate(`search/${search}`);
      handelBlue();
    }
  };

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

  return (
    <Container>
      <H4>you-music</H4>
      <RightContent>
        <IconWrap>
          <Left
            theme="outline"
            size="24"
            fill="rgb(237, 90, 101)"
            onClick={() => window.history.back()}
          />
          <Right
            theme="outline"
            size="24"
            fill="rgb(237, 90, 101)"
            onClick={() => window.history.forward()}
          />
        </IconWrap>
        <User>
          <Tooltip title="输入歌曲名或歌手 按下enter搜索">
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="输入歌曲名或歌手"
              style={{ width: "50%" }}
              onBlur={() => setTimeout(() => handelBlue(), 1000)}
              onFocus={handelBlue}
              onPressEnter={(e) => handelEnter(e)}
            />
          </Tooltip>
          <Popover
            content={
              _.isEmpty(profile) ? (
                <Qrcode />
              ) : (
                <UserDetail uid={profile.userId} />
              )
            }
            trigger="click"
          >
            <div>
              {_.isEmpty(profile) ? (
                <Button
                  style={{
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    borderRadius: "5rem",
                  }}
                >
                  请登录
                </Button>
              ) : (
                <>
                  <Avatar
                    style={{ backgroundColor: "pink", verticalAlign: "middle" }}
                    size="large"
                    icon={
                      <img
                        src={!_.isEmpty(profile) ? profile.avatarUrl : null}
                      />
                    }
                  />
                  <Tooltip title={profile.nickname}>
                    <span
                      style={{
                        margin: "0 0.5rem",
                        display: "inline-block",
                        fontSize: "0.8rem",
                      }}
                    >
                      {!_.isEmpty(profile) ? profile.nickname : null}
                    </span>
                  </Tooltip>
                </>
              )}
            </div>
          </Popover>
        </User>
      </RightContent>
      {!search && (
        <SearchContent style={{ display: open ? "" : "none" }}>
          {/* {!search ? ( */}
          <HotList handelBlue={handelBlue} />
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
`;

const H4 = styled.h4`
  margin: 0;
  width: 19%;
  /* background: yellowgreen; */
  height: 100%;
  line-height: 3.75rem;
  text-align: center;
  position: relative;
  color: rgb(237, 90, 101);
`;

const RightContent = styled.div`
  width: calc(100% - 19%);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const User = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 2.5rem;
`;

const SearchContent = styled.div`
  width: 18rem;
  height: 35rem;
  background: rgb(230, 210, 213);
  position: absolute;
  top: 3.75rem;
  right: 8rem;
  z-index: 20;
  overflow-y: auto;
`;

const IconWrap = styled.div`
  margin-left: 2.2rem;

  span {
    margin: 0 0.5rem;
    cursor: pointer;
  }
`;