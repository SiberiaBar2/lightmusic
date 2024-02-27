import { createSlice } from "@reduxjs/toolkit";

export interface ToneQualityState {
  toneQuality?: {
    key: string;
    label: string;
  };
}

const initialState: ToneQualityState = {
  toneQuality: {
    key: "standard",
    label: "标准",
  },
};

export const toneQualityState = createSlice({
  name: "toneQuality",
  initialState,
  reducers: {
    changeToneQuality: (state, { payload }) => {
      state.toneQuality = payload.toneQuality;
    },
  },
});

export const changeToneQuality = toneQualityState.actions.changeToneQuality;

export default toneQualityState.reducer;
