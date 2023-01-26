import { createSlice } from "@reduxjs/toolkit";

export interface songsState {
  songId?: number | string;
  song: number | string;
  prevornext: string;
}

const initialState: songsState = {
  songId: 0,
  song: 0,
  prevornext: "0",
};

export const songsSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    songsInfo: (state, { payload }) => {
      state.songId = payload.songId;
      state.song = payload.song;
      state.prevornext = payload.prevornext;
    },
  },
});

export const songsInfo = songsSlice.actions.songsInfo;

export default songsSlice.reducer;
