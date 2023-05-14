import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  ForwardedRef,
} from "react";
import { Modal } from "antd";

interface ModalProps {
  title: string;
  onOkNext?: () => void;
}

export const CommonModal = forwardRef(
  (
    props: React.PropsWithChildren<ModalProps>,
    ref: ForwardedRef<{ openModal: () => void }>
  ) => {
    const { children, title, onOkNext } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      openModal: () => setIsModalOpen(true),
    }));

    const handleOk = () => {
      setIsModalOpen(false);
      onOkNext && onOkNext();
    };

    const handleCancel = () => {
      setIsModalOpen(false);
    };

    return (
      <Modal
        okText={"确定"}
        title={title || "退出登录？"}
        cancelText={"取消"}
        onOk={handleOk}
        open={isModalOpen}
        maskClosable={false}
        onCancel={handleCancel}
      >
        {children}
      </Modal>
    );
  }
);
