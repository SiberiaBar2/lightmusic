import { createSlice } from "@reduxjs/toolkit";

export interface playState {
  songId?: number | string | null;
}

const initialState: playState = {
  songId: null,
};

export const songIdSlice = createSlice({
  name: "play",
  initialState,
  reducers: {
    getSongId: (state, { payload }) => {
      state.songId = payload;
    },
  },
});

export const getSongId = songIdSlice.actions.getSongId;

export default songIdSlice.reducer;
