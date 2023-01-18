import { Button } from "antd";
import { useUserDetail } from "users";

export const UserDetail = ({ uid }: { uid: number }) => {
  const {
    data: { level = 0, listenSongs = 0, profile: { vipType = 0 } = {} } = {},
  } = useUserDetail(uid);

  return (
    <div>
      <p>等级： {level}</p>
      <p>听歌数： {listenSongs}</p>
      <p>vip等级 {vipType}</p>
      <Button>退出登录</Button>
    </div>
  );
};
