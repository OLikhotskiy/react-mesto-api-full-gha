import React from "react";
import logo from "../images/Logo.svg";
import NavBar from "./NavBar";

function Header({ email, onLogOut }) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Место Россия" />
      <NavBar email={email} onLogOut={onLogOut} />
    </header>
  );
}

export default Header;
