import { createSlice } from "@reduxjs/toolkit";

export interface TimeState {
  str?: string;
}

const initialState: TimeState = {
  str: "",
};

export const timeStrSlice = createSlice({
  name: "timestr",
  initialState,
  reducers: {
    changeTimeStr: (state, { payload }) => {
      state.str = payload.str;
    },
  },
});

export const changeTimeStr = timeStrSlice.actions.changeTimeStr;

export default timeStrSlice.reducer;
