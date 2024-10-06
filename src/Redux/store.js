import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./ReducerSlice/userSlices";
import postReducer from "./ReducerSlice/postSlice";
import {statusReducer} from "./ReducerSlice/statusReducer";

const Store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    status: statusReducer
  },
});

export default Store;
