import { DELETE_FILES, GET_FILES, UPLOAD_FILES } from "./FilesConstants";

const initialState = {
  files: [],
};

export default function filesReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_FILES:
      return {
        ...state,
        files: payload,
      };
    case UPLOAD_FILES:
      return {
        ...state,
        files: [...state.files, payload],
      };
    case DELETE_FILES:
      return {
        ...state,
        files: [...state.files.filter((file) => file.id !== payload)],
      };
    default: {
      return state;
    }
  }
}
