import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import PostList from "./components/PostList";
import Login from "./components/Login";
import Edit from "./components/Edit";
import Create from "./components/Create";
import Post from "./components/Post";
import Navbar from "./components/Navbar";
import * as firebase from 'firebase/app';
import 'firebase/auth';

// Secure routes
function AuthenticatedRoute({
  component: Component,
  authenticated,
  redirect = "/login",
  ...rest
}) {
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
        console.log("User is logged in");
      } else {
        console.log("User is logged out");
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
            <Switch>
              <Route exact path="/" component={PostList} />
              <AuthenticatedRoute
                exact
                path="/login"
                authenticated={this.state.user == null}
                redirect="/"
                component={Login}
              />
              {/* FIXME: NB duplicate route. Normal Routes are handy for debugging
              <Route exact path="/create" component={Create} /> */}
              <AuthenticatedRoute
                exact
                path="/create"
                authenticated={this.state.user != null}
                component={Create}
              />*/}
              <Route
                exact
                path="/post/:id"
                render={props => <Post {...props} />}
              />
              {/* FIXME: NB duplicate route. Normal Routes are handy for debugging
              <Route
                exact
                path="/edit/:postkey/:commentid"
                render={props => <Edit {...props} />}
              />*/}
              <AuthenticatedRoute
                exact
                path="/edit/:postkey/:commentid"
                authenticated={this.state.user != null}
                component={Edit}
              />
              <Route exact path="*" render={() => <h1>Page not found</h1>} />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}
