import {
  CREATE_CORR,
  DELETE_CORR,
  FETCH_CORRS,
  UPDATE_CORR,
} from "./CorrsConstants";

export function listenToCorrs(corrs) {
  return {
    type: FETCH_CORRS,
    payload: corrs,
  };
}

export function createReminder(corr) {
  return {
    type: CREATE_CORR,
    payload: corr,
  };
}

export function updateReminder(corr) {
  return {
    type: UPDATE_CORR,
    payload: corr,
  };
}

export function deleteReminder(corrId) {
  return {
    type: DELETE_CORR,
    payload: corrId,
  };
}
