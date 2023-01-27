import { createSlice } from "@reduxjs/toolkit";

export interface likeState {
  likes: Array<number>;
}

const initialState: likeState = {
  likes: [],
};

export const ilikeSlice = createSlice({
  name: "ilike",
  initialState,
  reducers: {
    changelike: (state, { payload }) => {
      state.likes = payload.likes;
    },
  },
});

export const changelike = ilikeSlice.actions.changelike;

export default ilikeSlice.reducer;
