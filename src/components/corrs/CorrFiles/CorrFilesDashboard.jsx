import React from "react";
import { useDispatch } from "react-redux";
import { Button, Icon } from "semantic-ui-react";
import { openModal } from "../../modals/modalReducer";

export default function CorrFilesDashboard({ corr }) {
  const dispatch = useDispatch();

  return (
    <>
            <Button
              icon
              labelPosition="left"
              color="violet"

              onClick={() =>
            dispatch(
              openModal({
                modalType: "UploadFile",
                modalProps: corr,
              })
            )
          }
            >
              <Icon name="upload" />
              Upload a File
            </Button>
            <Button
              icon
              labelPosition="left"
              color="blue"
              onClick={() =>
            dispatch(
              openModal({
                modalType: "CorrFile",
                modalProps: corr,
              })
            )
          }
            >
              <Icon name="eye" />
              View Files
            </Button>
         
  
    </>
  );
}
