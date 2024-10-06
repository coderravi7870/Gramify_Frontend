// actions/statusAction.js
import axios from "axios";
import { server } from "../../server/server";

export const fetchAllStatus = () => async (dispatch) => {
  try {
    const response = await axios.get(`${server}/status/allStatus_list`, {
      withCredentials: true,
    });
    // console.log(response.data);
    
    if (response.data.success) {
      dispatch({
        type: "FETCH_STATUS_SUCCESS",
        payload: response.data.allStatus,
      });
    } else {
      dispatch({
        type: "FETCH_STATUS_FAIL",
        payload: response.data.message,
      });
    }
  } catch (error) {
    dispatch({
      type: "FETCH_STATUS_FAIL",
      payload: error.message,
    });
  }
};
