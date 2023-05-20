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
  cancel?: string;
}

export const CommonModal = forwardRef(
  (
    props: React.PropsWithChildren<
      Omit<React.ComponentProps<typeof Modal>, "title" | "cancel"> & ModalProps
    >,
    ref: ForwardedRef<{ openModal: () => void }>
  ) => {
    const { children, title, onOkNext, cancel, ...others } = props;
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
        cancelText={cancel || "取消"}
        onOk={handleOk}
        open={isModalOpen}
        maskClosable={true}
        onCancel={handleCancel}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        {...others}
      >
        {children}
      </Modal>
    );
  }
);
