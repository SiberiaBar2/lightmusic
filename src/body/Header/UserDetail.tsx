import { Button, message } from "antd";
import { useUserDetail } from "users";

export const UserDetail: React.FC<{ uid: number }> = ({ uid }) => {
  const {
    data: { level = 0, listenSongs = 0, profile: { vipType = 0 } = {} } = {},
  } = useUserDetail(uid);

  return (
    <div>
      <p>等级： {level}</p>
      <p>听歌数： {listenSongs}</p>
      <p>viptype： {vipType}</p>
      <Button onClick={() => message.warning("暂不支持", 1)}>退出登录</Button>
    </div>
  );
};
