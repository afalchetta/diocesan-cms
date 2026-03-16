import { FETCH_REPLIES, CREATE_REPLY, DELETE_REPLY } from "./repliesConstants";

const initialState = {
  replies: [],
};

export default function repliesReducer(state = initialState, {type, payload}) {
  switch (type) {
    case FETCH_REPLIES:
      return { ...state, replies: payload};
    case CREATE_REPLY:
      return { ...state, replies: [...state.replies, payload] };
    case DELETE_REPLY:
      return { ...state, replies: state.replies.filter(r => r.id !== payload) };
    default:
      return state;
  }
}
