import { createSlice } from "@reduxjs/toolkit";

export interface LoginState {
  data: any;
  islogin?: boolean;
}

const initialState: LoginState = {
  data: {},
  islogin: false,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    getUserInfo: (state, { payload }) => {
      console.log("store ===》 ", payload);
      state.data = payload;
    },
    changeLogin: (state, { payload }) => {
      console.warn("payload", payload);
      state.islogin = payload.islogin;
    },
  },
});

export const getSongId = loginSlice.actions.getUserInfo;

export default loginSlice.reducer;
