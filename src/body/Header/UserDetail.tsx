import { Button, message, Popconfirm } from "antd";
import { useMemo } from "react";
import { useUserDetail } from "users";
import { useLogout } from "./utils";

export const UserDetail: React.FC<{ uid: number }> = ({ uid }) => {
  const {
    data: { level = 0, listenSongs = 0, profile: { vipType = 0 } = {} } = {},
  } = useUserDetail(uid);

  const { mutate: logout, data } = useLogout();

  useMemo(() => {
    if (data?.code === 200) {
      message.success("退出成功");

      // 这里接口响应不及时、会出现两次退出登录的情况！
      // 因此，采用直接清除缓存的方式
      // localStorage.clear();
      // window.location.reload();
    }
  }, [data]);

  const confirm = () => {
    logout();
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div>
      <p>等级： {level}</p>
      <p>听歌数： {listenSongs}</p>
      <p>viptype： {vipType}</p>
      <Popconfirm
        title="退出登录"
        description="确认退出"
        onConfirm={confirm}
        placement="left"
        // onCancel={cancel}
        okText="确定"
        cancelText="取消"
      >
        <Button>退出登录</Button>
      </Popconfirm>
    </div>
  );
};
