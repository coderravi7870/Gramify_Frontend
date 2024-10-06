import axios from "axios";
import { server } from "../../server/server";
import {
  postGetFailed,
  postGetSuccess,
  postRequest,
} from "../ReducerSlice/postSlice";

export const getAllPost = () => async (dispatch) => {
  try {
    
    dispatch(postRequest());

    // console.log("Ram ram");

    const { data } = await axios.get(`${server}/posts/getallpost`, {
      withCredentials: true,
    });

    // console.log("data",data.result);

    if(data.success){
      dispatch(postGetSuccess(data.result));
    }else{
      dispatch(postGetFailed(data.message));
    }

  } catch (error) {
    dispatch(postGetFailed(error?.result?.data?.message));
  }
};
