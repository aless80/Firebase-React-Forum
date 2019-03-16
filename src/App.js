import React, { Component } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Main from "./components/Main";
import Login from "./components/Login";
import Edit from "./components/Edit";
import Create from "./components/Create";
import Show from "./components/Show";
import Navbar from "./components/Navbar";
import firebase from "./Firebase";

// Secure routes
function AuthenticatedRoute({ component: Component, authenticated, redirect="/login", ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect to={redirect} />
        )
      }
    />
  );
}

export default class App extends Component {
  state = {
    user: null
  };

  setUser = user => {
    this.setState({ user: user });
  };

  // Listen to auth state changes
  initFirebaseAuth() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('User is logged in')
      } else {
        console.log('User is logged out')
      }
      this.setUser(user);
    });
  }

  componentDidMount() {
    this.initFirebaseAuth();
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar setuserCallback={this.setUser} />
          <main className="mdl-layout__content mdl-color--grey-100">
            <Route exact path="/" component={Main} />
            <AuthenticatedRoute exact path="/login" authenticated={this.state.user == null} redirect="/" component={Login} />
            <AuthenticatedRoute
              exact
              path="/edit/:id"
              authenticated={this.state.user != null}
              component={Edit}
            />
            <AuthenticatedRoute
              exact
              path="/create"
              authenticated={this.state.user != null}
              component={Create}
            />
            <Route
              exact
              path="/show/:id"
              render={props => <Show {...props} />}
            />
          </main>
        </div>
      </BrowserRouter>
    );
  }
}
