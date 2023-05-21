import { createSlice } from "@reduxjs/toolkit";

export interface PictState {
  picturl: string;
}

const initialState: PictState = {
  picturl: "",
};

export const picturlSlice = createSlice({
  name: "picturl",
  initialState,
  reducers: {
    changePicturl: (state, { payload }) => {
      state.picturl = payload.picturl;
    },
  },
});

export const changePicturl = picturlSlice.actions.changePicturl;

export default picturlSlice.reducer;
