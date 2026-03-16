import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal } from "semantic-ui-react";
import { openModal } from "./modals/modalReducer";

export default function UnauthModal() {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();

  function handleClose() {
    setOpen(false);
  }

  return (
    <Modal open={open} size="mini" onClose={handleClose}>
      <Modal.Header content="Please Login" />
      <Modal.Content>
        <p>You need to login to view any info.</p>
        <Button
          fluid
          color="teal"
          content="Login"
          onClick={() => dispatch(openModal({ modalType: "LoginForm" }))}
        />
      </Modal.Content>
    </Modal>
  );
}
