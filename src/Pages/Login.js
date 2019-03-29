import React, { Component } from "react";
import { Link } from "react-router-dom";
import { signIn } from "../Scripts/firebase";


export default class Login extends Component {
  render() {
    return (
      <div className="container">
        <div className="panel panel-default">
          <br />
          <div className="panel-heading">
            <h3 className="panel-title">Sign in with Google</h3>
          </div>
          <br />
          <div className="panel-body">
            <Link to="/">
              <button className="btn btn-bgn ml-0" onClick={signIn}>
                Log in
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
