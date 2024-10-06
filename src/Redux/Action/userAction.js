import axios from "axios";
import { server } from "../../server/server";
import {
  userAllGetFailed,
  userAllGetSuccess,
  userAllRequest,
  userGetFailed,
  userGetSuccess,
  userRequest,
} from "../ReducerSlice/userSlices";

export const userLoader = () => async (dispatch) => {
  try {
    
    dispatch(userRequest());
    
    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
    });
    
    if(data.success){
      dispatch(userGetSuccess(data.data));
    }else{
      dispatch(userGetFailed(data.message));
    }
    

  } catch (error) {
    dispatch(userGetFailed(error?.result?.data?.message));
  }
};

// get all users

export const getAllUsers = () => async (dispatch) => {
  try {
    
    dispatch(userAllRequest());
    const { data } = await axios.get(`${server}/user/getalluser`, {
      withCredentials: true,
    });
    // console.log(data);
    

    if(data.success){
      dispatch(userAllGetSuccess(data.result));
    }else{
      dispatch(userAllGetFailed(data.message));
    }
    

  } catch (error) {
    dispatch(userAllGetFailed(error?.result?.data?.message));
  }
};
