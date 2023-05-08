import { createSlice } from "@reduxjs/toolkit";

export interface playState {
  play?: string;
}

const initialState: playState = {
  play: "init",
};

export const playSlice = createSlice({
  name: "play",
  initialState,
  reducers: {
    changePlay: (state, { payload }) => {
      state.play = payload.play;
    },
  },
});

export const changePlay = playSlice.actions.changePlay;

export default playSlice.reducer;
