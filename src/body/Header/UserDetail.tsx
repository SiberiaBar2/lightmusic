import styled from "@emotion/styled";
import { message } from "antd";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUserDetail } from "users";
import { useLogout } from "./utils";
import stroe from "store";
import { loginSlice } from "store/login";
import { changelike } from "store/ilike";
import { useDispatch } from "react-redux";

export const UserDetail: React.FC<{ uid: number }> = ({ uid }) => {
  const dispatch = useDispatch();
  const {
    data: { level = 0, listenSongs = 0, profile: { vipType = 0 } = {} } = {},
  } = useUserDetail(uid);

  const { getUserInfo, changeLogin } = loginSlice.actions;

  const { mutate: logout, data } = useLogout();
  const navigate = useNavigate();

  const confirm = () => {
    logout();
    stroe.dispatch(getUserInfo({ data: {} }));
    stroe.dispatch(changeLogin({ islogin: false }));
    localStorage.removeItem("cookie");
    // localStorage.clear();
    dispatch(
      changelike({
        likes: [],
      })
    );
    setTimeout(() => {
      navigate("/main/recommendsongsheet");
    }, 300);
  };

  useMemo(() => {
    if (data?.code === 200) {
      message.success("退出成功");
      // 这里接口响应不及时、会出现两次退出登录的情况！
      // 因此，采用直接清除缓存的方式
      // localStorage.clear();
      // window.location.reload();
    }
  }, [data]);

  return (
    <Content>
      <div>
        <p>等级： {level}</p>
        <p>听歌数： {listenSongs}</p>
        <p>viptype： {vipType}</p>
        <p onClick={() => confirm()}>退出登录</p>
      </div>
    </Content>
  );
};

const Content = styled.div`
  position: relative;
  > div {
    position: absolute;
    width: 14rem;
  }
`;
