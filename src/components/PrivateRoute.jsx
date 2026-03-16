import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import LoginForm from "./auth/LoginForm";

export default function PrivateRoute() {
  const { authenticated } = useSelector((state) => state.auth);

  return authenticated ? <Outlet /> : <LoginForm />;
}
