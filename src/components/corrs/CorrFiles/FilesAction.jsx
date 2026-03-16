import { DELETE_FILES, GET_FILES, UPLOAD_FILES } from "./FilesConstants";

export function listenToFiles(files) {
  return {
    type: GET_FILES,
    payload: files,
  };
}

export function uploadLocationFiles(files) {
  return {
    type: UPLOAD_FILES,
    payload: files,
  };
}

export function deleteLocationFile(fileID) {
  return {
    type: DELETE_FILES,
    payload: fileID,
  };
}
