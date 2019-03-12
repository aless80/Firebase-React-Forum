import React, { Component } from "react";

import { BrowserRouter, Route } from "react-router-dom";

import Main from "./components/Main";
import Edit from "./components/Edit";
import Create from "./components/Create";
import Show from "./components/Show";
import Navbar from "./components/Navbar";

export default class App extends Component {
  state = {
    user: null
  }
  
  setUser = (userFromChild) => {
    this.setState({ user: userFromChild });
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar setuserCallback={this.setUser} />
          <main className="mdl-layout__content mdl-color--grey-100">
            <Route exact path="/" component={Main} />
            <Route exact path="/edit/:id" render={(props) => <Edit {...props} user={this.state.user} />} />
            <Route exact path="/create" component={Create} />
            <Route exact path="/show/:id" render={(props) => <Show {...props} user={this.state.user} />} />
          </main>
        </div>
      </BrowserRouter>
    );
  }
}
