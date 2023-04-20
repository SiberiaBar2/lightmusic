import styled from "@emotion/styled";
import { Button, message, Modal, Typography } from "antd";
import { useMemo, useState } from "react";
import { useUserDetail } from "users";
import { useLogout } from "./utils";

export const UserDetail: React.FC<{ uid: number }> = ({ uid }) => {
  const {
    data: { level = 0, listenSongs = 0, profile: { vipType = 0 } = {} } = {},
  } = useUserDetail(uid);

  const { mutate: logout, data } = useLogout();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const confirm = () => {
    logout();
    localStorage.clear();
    window.location.reload();
  };

  const handleOk = () => {
    setIsModalOpen(false);
    confirm();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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

  const renderInfo = () => (
    <>
      <p>等级： {level}</p>
      <p>听歌数： {listenSongs}</p>
      <p>viptype： {vipType}</p>
      <Button onClick={() => showModal()}>退出登录</Button>
    </>
  );

  const renderModal = () => (
    <Modal
      okText={"确定"}
      title="退出登录？"
      cancelText={"取消"}
      onOk={handleOk}
      open={isModalOpen}
      maskClosable={false}
      onCancel={handleCancel}
    >
      <Content>
        <Typography.Text>亲，确认退出吗？</Typography.Text>
      </Content>
    </Modal>
  );

  return (
    <>
      {renderInfo()}
      {renderModal()}
    </>
  );
};

const Content = styled.div`
  height: 8rem;
  line-height: 5rem;
  padding: 2rem;
`;
