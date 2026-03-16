import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Menu } from "semantic-ui-react";
import { signOutFirebase } from "../../firestore/firebaseService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function SignedInMenu() {
  const { currentUserProfile } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  async function handleSignout() {
    try {
      navigate("/corrs");
      await signOutFirebase();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <Menu.Item position="right">
      <Dropdown pointing="top right" text={currentUserProfile?.displayName}>
        <Dropdown.Menu>
          <Dropdown.Item
            text="My Account"
            icon="user"
            as={Link}
            to={`/profile/${currentUserProfile?.id}`}
          />
          <Dropdown.Item
            onClick={handleSignout}
            icon="sign-out"
            text="Sign Out"
          />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
}
