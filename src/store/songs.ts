import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface songsState {
  songId?: number | string;
  song: number | string;
  prevornext: string;
  platList: any[];
}

const initialState: songsState = {
  songId: 0,
  song: 0,
  prevornext: "0",
  platList: [],
};

interface SongsInfoPayload {
  songId?: number | string;
  song?: number | string;
  prevornext?: string;
  platList?: any[];
}

export const songsSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    songsInfo: (state, { payload }: PayloadAction<SongsInfoPayload>) => {
      if (payload.songId !== undefined) state.songId = payload.songId;
      if (payload.song !== undefined) state.song = payload.song;
      if (payload.prevornext !== undefined)
        state.prevornext = payload.prevornext;
      if (payload.platList !== undefined) state.platList = payload.platList;
    },
  },
});

export const { songsInfo } = songsSlice.actions;

export default songsSlice.reducer;
