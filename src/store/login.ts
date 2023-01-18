import { createSlice } from "@reduxjs/toolkit";

export interface LoginState {
  data: any;
}

const initialState: LoginState = {
  data: {},
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    getUserInfo: (state, { payload }) => {
      state.data = payload;
    },
  },
});

export const getSongId = loginSlice.actions.getUserInfo;

export default loginSlice.reducer;
