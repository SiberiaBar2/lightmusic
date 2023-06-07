import styled from "@emotion/styled";
import { message } from "antd";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUserDetail } from "users";
import { useLogout } from "./utils";
export const UserDetail: React.FC<{ uid: number }> = ({ uid }) => {
  const {
    data: { level = 0, listenSongs = 0, profile: { vipType = 0 } = {} } = {},
  } = useUserDetail(uid);

  const { mutate: logout, data } = useLogout();
  const navigate = useNavigate();

  const confirm = () => {
    logout();
    localStorage.clear();
    navigate("main/recommendsongsheet");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
    <div>
      <p>等级： {level}</p>
      <p>听歌数： {listenSongs}</p>
      <p>viptype： {vipType}</p>
      <p onClick={() => confirm()}>退出登录</p>
    </div>
  );
};

const Content = styled.div`
  height: 8rem;
  line-height: 5rem;
  padding: 2rem;
`;
