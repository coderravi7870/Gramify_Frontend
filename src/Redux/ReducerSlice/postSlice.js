import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoding: false,
  // post: null,
  // error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    postRequest: (state) => {
      state.isLoding = true;
    },
    postGetSuccess: (state, action) => {
      state.isLoding = false;
      state.post = action.payload;
    },
    postGetFailed: (state, action) => {
      state.isLoding = false;
      state.error = action.payload;
    },

    cleareError: (state) => {
      state.error = null;
    },
  },
});


export const {postRequest,postGetSuccess,postGetFailed, cleareError} = postSlice.actions;

export default postSlice.reducer;


