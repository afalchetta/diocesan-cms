import React from "react";
import { useSelector } from "react-redux";
import EditCorr from "../corrs/EditCorr";
import LoginForm from "../auth/LoginForm";
import UploadFile from "../corrs/CorrFiles/UploadFile";
import CorrFile from "../corrs/CorrFiles/CorrFile";

export default function ModalManager() {
  const modalLookup = {
    EditCorr,
    LoginForm,
    UploadFile,
    CorrFile,
  };
  const currentModal = useSelector((state) => state.modals);
  let renderedModal;

  if (currentModal) {
    const { modalType, modalProps } = currentModal;
    const ModalComponent = modalLookup[modalType];
    renderedModal = <ModalComponent {...modalProps} />;
  }

  return <span>{renderedModal}</span>;
}
