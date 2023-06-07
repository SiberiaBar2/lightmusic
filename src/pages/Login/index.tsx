import React from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import Qrcode from "body/Header/Qrcode";
import { UserDetail } from "body/Header/UserDetail";
import { loginSlice, LoginState } from "store/login";
import { useSelector } from "react-redux";
import { RootState } from "store";

export const Login: React.FC = () => {
  const { islogin } = useParams();
  const loginState = useSelector<
    RootState,
    Pick<LoginState, "data" | "islogin">
  >((state) => state.login);

  // 解构赋值 真正的默认值
  const { data: { data: { profile = {} } = {} } = {} } = loginState;

  return (
    <Container>
      {islogin === "unlogin" ? <Qrcode /> : <UserDetail uid={profile.userId} />}
    </Container>
  );
};

const Container = styled.div`
  height: calc(100% - 10.9rem);
  display: flex;
  justify-content: center;
  align-items: center;
`;
