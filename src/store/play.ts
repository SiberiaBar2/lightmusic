import { createSlice } from "@reduxjs/toolkit";

export interface playState {
  play?: boolean;
}

const initialState: playState = {
  play: false,
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
