import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button, Menu,  } from "semantic-ui-react";
import Logo from "../../assets/DOC_logo.png";
import SignedOutMenu from "./SignedOutMenu";
import { useSelector } from "react-redux";
import SignedInMenu from "./SignedInMenu";
import moment from "moment";

export default function NavBar() {
  const { authenticated } = useSelector((state) => state.auth);
  const pathName = useLocation();
  

return (
  <Menu
  fixed="top"
  borderless
  style={{
    height: "70px",
    padding: "0 20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    zIndex: 1000,
  }}
>
  {/* Logo */}
  <Menu.Item
    as={NavLink}
    to="/"
    style={{ paddingRight: "30px" }}
  >
    <img
      src={Logo}
      alt="Diocese of Camden"
      style={{ height: "45px", width: "auto" }}
    />
  </Menu.Item>

  {/* Primary Action Button */}
  {authenticated && (
    pathName.pathname !== "/newcorr" ? (
      <Menu.Item>
        <Button
          icon="plus"
          content="New Correspondence"
          as={NavLink}
          to="/newcorr"
        />
      </Menu.Item>
    ) : (
      <Menu.Item>
        <Button
          basic
          icon="home"
          content="Dashboard"
          as={NavLink}
          to="/corrs"
        />
      </Menu.Item>
    )
  )}

  {/* Right side */}
  <Menu.Menu position="right" style={{ alignItems: "center" }}>

    {/* Date */}
    <Menu.Item
      style={{
        opacity: 0.7,
        fontSize: "0.9rem",
        marginRight: "15px",
      }}
    >
      {moment().format("MMMM Do, YYYY")}
    </Menu.Item>

    {/* Auth Menu */}
    {authenticated ? <SignedInMenu /> : <SignedOutMenu />}

  </Menu.Menu>
</Menu>

);

}
