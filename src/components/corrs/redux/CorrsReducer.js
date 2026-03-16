import {
  CREATE_CORR,
  DELETE_CORR,
  FETCH_CORRS,
  UPDATE_CORR,
} from "./CorrsConstants";

const initialState = {
  corrs: [],
};

export default function corrReducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case FETCH_CORRS:
      return {
        ...state,
        corrs: payload,
      };
    case CREATE_CORR:
      return {
        ...state,
        corrs: [...state.corrs, payload],
      };
    case DELETE_CORR:
      return {
        ...state,
        corrs: [
          ...state.corrs.filter((corr) => corr.id !== payload),
        ],
      };
    case UPDATE_CORR:
      return {
        ...state,
        corrs: [
          ...state.corrs.filter((corr) => corr.id !== payload.id),
          payload,
        ],
      };
    default:
      return state;
  }
}
