// reducers/statusReducer.js
const initialState = {
    statusList: [],
    error: null,
  };
  
  export const statusReducer = (state = initialState, action) => {
    switch (action.type) {
      case "FETCH_STATUS_SUCCESS":
        return {
          ...state,
          statusList: action.payload,
        };
      case "FETCH_STATUS_FAIL":
        return {
          ...state,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  