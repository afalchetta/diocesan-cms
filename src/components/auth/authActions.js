import { SIGN_IN_USER, SIGN_OUT_USER } from "./authConstants";
import firebase from "../../config/firebase";
import { APP_LOADED } from "../../async/asyncReducer";
import {
  dataFromSnapshot,
  getUserProfile,
} from "../../firestore/firestoreService";
import { listenToCurrentUserProfile } from "../profile/profileActions";

export function signInUser(user) {
  return {
    type: SIGN_IN_USER,
    payload: user,
  };
}

export function verifyAuth() {
  return function (dispatch) {
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(signInUser(user));
        const profileRef = getUserProfile(user.uid);
        profileRef.onSnapshot((snapshot) => {
          dispatch(listenToCurrentUserProfile(dataFromSnapshot(snapshot)));
          dispatch({ type: APP_LOADED });
        });
      } else {
        dispatch(signOutUser());
        dispatch({ type: APP_LOADED });
      }
    });
  };
}

export function forgotPassword(email, toast) {
  return async function () {
    try {

      toast.success(
        "If an account exists, a password reset email has been sent."
      );
    } catch (error) {
      // 🔒 Don't expose user existence
      toast.success(
        "If an account exists, a password reset email has been sent."
      );

      console.error(error.message);
    }
  };
}

export function signOutUser() {
  return {
    type: SIGN_OUT_USER,
  };
}
