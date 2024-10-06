import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userRequest: (state) => {
      state.isLoding = true;
    },
    userGetSuccess: (state, action) => {
      state.isLoding = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    userGetFailed: (state, action) => {
      state.isLoding = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // get all users

    userAllRequest: (state) => {
      state.isLoding = true;
    },
    userAllGetSuccess: (state, action) => {
      state.isLoding = false;
      state.alluser = action.payload;
    },
    userAllGetFailed: (state, action) => {
      state.isLoding = false;
      state.error = action.payload;
    },

    cleareError: (state) => {
      state.error = null;
    },
  },
});


export const {userRequest,userGetSuccess,userGetFailed, cleareError,userAllRequest,userAllGetSuccess,userAllGetFailed} = userSlice.actions;

export default userSlice.reducer;


