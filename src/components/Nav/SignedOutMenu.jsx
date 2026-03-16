import React from "react";
import { Button, Menu } from "semantic-ui-react";
import { openModal } from "../modals/modalReducer";
import { useDispatch } from "react-redux";

export default function SignedOutMenu() {
  const dispatch = useDispatch();
  return (
    <Menu.Item position="right">
      <Button
        onClick={() => dispatch(openModal({ modalType: "LoginForm" }))}
        basic
        color="teal"
        content="Login"
      />
    </Menu.Item>
  );
}
