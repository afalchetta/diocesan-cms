import { combineReducers } from "redux";
import corrReducer from "../components/corrs/redux/CorrsReducer";
import asyncReducer from "../async/asyncReducer";
import modalReducer from "../components/modals/modalReducer";
import authReducer from "../components/auth/authReducer";
import profileReducer from "../components/profile/profileReducer";
import filesReducer from "../components/corrs/CorrFiles/FilesReducer";
import repliesReducer from "../components/corrs/replies/repliesReducer";

const rootReducer = combineReducers({
  corrs: corrReducer,
  async: asyncReducer,
  modals: modalReducer,
  auth: authReducer,
  profile: profileReducer,
  replies:repliesReducer,
  files: filesReducer,
});

export default rootReducer;
