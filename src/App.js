import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { Navbar, Nav, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import "./App.css";

import { Auth } from "aws-amplify";

const body = document.querySelector("body");

function App(props) {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    onLoad();
  }, []);

  function handleImgLoad() {}

  async function onLoad() {
    try {
      const image = new Image();
      image.src = `Images/${Math.floor(Math.random() * 12) + 1}.jpg`;
      image.addEventListener("loadend", handleImgLoad);
      image.classList.add("bgImg");
      body.prepend(image);

      await Auth.currentSession();
      const info = await Auth.currentUserInfo();
      setUserInfo(info);
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    props.history.push("/login");
  }

  return (
    !isAuthenticating && (
      <div className="App">
        <div className="App-header">
          <div className="App-brand">
            <Link to="/">
              <span className="App-brand-title">Daily Focus</span>
            </Link>
          </div>
          <div className="App-user">
            {isAuthenticated &&
            userInfo &&
            userInfo.attributes &&
            userInfo.attributes.email ? (
              <>
                <Link to="/">
                  <span className="App-user-title">
                    @{userInfo.attributes.email.split("@")[0]}
                  </span>
                </Link>
                <Link to="/week">
                  <span className="App-user-title">Week</span>
                </Link>
                <Link onClick={handleLogout}>
                  <span className="App-user-title">Logout</span>
                </Link>
              </>
            ) : (
              <>
                <div className="App-user-nojoin">
                  <Link to="/signup">Signup</Link>
                  <Link to="/login">Login</Link>
                </div>
              </>
            )}
          </div>
        </div>
        {/* <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Daily Focus</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {isAuthenticated &&
              userInfo &&
              userInfo.attributes &&
              userInfo.attributes.email ? (
                <>
                  <NavItem>@{userInfo.attributes.email.split("@")[0]}</NavItem>
                  <LinkContainer to="/week">
                    <NavItem>Week</NavItem>
                  </LinkContainer>
                  <NavItem onClick={handleLogout}>Logout</NavItem>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar> */}
        <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
      </div>
    )
  );
}

export default withRouter(App);
