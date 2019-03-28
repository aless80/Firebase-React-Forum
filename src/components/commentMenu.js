import React, { Component } from "react";
import { getUserName } from "../Scripts/firebase";
import { Link } from "react-router-dom";

export default class commentMenu extends Component {
  toggleClose() {
    this.props.toggleCloseCallback();
  }

  delete() {
    this.props.deleteCallback();
  }

  render() {
    return (
      this.props.author === getUserName() && (
        <div className="postmenu small text-muted bottom-right">
          <Link
            to={"/edit/" + this.props.post_key + "/" + this.props.comment_id}
          >
            edit
          </Link>

          <span>&nbsp;&nbsp;</span>

          {this.props.comment_id === "1" && this.props.post_status === "open" && (
            <span>
              <button
                type="button"
                className="link-button"
                title="When closed no answer can be posted"
                onClick={() => this.toggleClose()}
              >
                close
              </button>
              <span>&nbsp;&nbsp;</span>
            </span>
          )}

          {this.props.comment_id === "1" &&
            this.props.post_status === "closed" && (
              <span>
                <button
                  type="button"
                  className="link-button"
                  title="Open this post again to new answers"
                  onClick={() => this.toggleClose()}
                >
                  open
                </button>
                <span>&nbsp;&nbsp;</span>
              </span>
            )}
          <button
            type="button"
            className="link-button"
            title="Delete the content of this comment/post"
            onClick={() => this.delete()}
          >
            delete
          </button>
        </div>
      )
    );
  }
}
