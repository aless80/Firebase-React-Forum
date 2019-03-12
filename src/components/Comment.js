import React, { Component } from "react";
import {
  getDateObject,
  getDateTime,
  timeDifference
} from "../Scripts/utilities";

class Comment extends Component {
  profilePicStyle(url) {
    if (!url) {
      console.error("Could not find picture url for post");
      return undefined;
    }
    if (
      url.indexOf("googleusercontent.com") !== -1 &&
      url.indexOf("?") === -1
    ) {
      url = url + "?sz=150";
    }
    return { backgroundImage: `url(${url})` };
  }
  render() {
    const hello = {
      flex: "1 1 100px"
    };
    return (
      <div align="center">
        <div className="comment-page text-left w-100">
          <div className="p-0" align="left">
            <div id={"edit" + this.props.comment.id} className="p-0">
              <table
                id={"post" + this.props.comment.id}
                className="tborder w-100 align-middle"
                cellSpacing="0"
                cellPadding="3"
              >
                <thead>
                  <tr>
                    <th
                      className="thead font-weight-light border border-right-0"
                      title={getDateTime(
                        getDateObject(this.props.comment.timestamp)
                      )}
                    >
                      {timeDifference(
                        getDateObject(this.props.comment.timestamp)
                      )}
                    </th>
                    <th className="thead font-weight-strong border border-left-0">
                      <span className="text-left">
                        {this.props.comment.id && "Re:"} {this.props.post_title}{" "}
                      </span>
                      {this.props.comment.id && (
                        <span className="float-right">
                          &nbsp; #
                          <a
                            href={"#reply" + this.props.comment.id}
                            rel="nofollow"
                            id={"reply" + this.props.comment.id}
                            name={this.props.comment.id}
                          >
                            <strong>{this.props.comment.id}</strong>
                          </a>
                        </span>
                      )}{" "}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="align-top">
                    <td
                      className={
                        "alt" + ((this.props.comment.id % 2) + 1) + " border"
                      }
                      width="175"
                    >
                      <div id={"postmenu_" + this.props.comment.id}>
                        <div className="font-weight-strong">
                          {this.props.comment.author}
                        </div>
                      </div>
                      <div className="small text-muted">
                        &nbsp;
                        <div
                          className="profile-pic"
                          style={this.profilePicStyle(
                            this.props.comment.profilePicUrl
                          )}
                          title={this.props.comment.author}
                        />
                        {/*
                          <br />
                          <div>Registered: </div>
                          <div>Latest activity: </div>
                          Need Admin SDK in priviledge environment
                          https://firebase.google.com/docs/admin/setup                          
                          */}
                      </div>
                    </td>
                    <td
                      className={
                        "alt" + ((this.props.comment.id % 2) + 1) + " border"
                      }
                      id={"td_post_" + this.props.comment.id}
                    >
                      <div id={"post_message_" + this.props.comment.id}>
                        {this.props.comment.text}
                      </div>

                      <div className="small text-muted" style={hello}>
                        <div className="post-menu">
                          <a
                            href={"/posts/" + this.props.comment.id + "/edit"}
                            className="suggest-edit-post"
                          >
                            edit
                          </a>
                          <span>&nbsp;</span>
                          {/*<a
                              href="#"
                              className="close-question-link"
                              data-isclosed="false"
                            >
                              delete
                            </a>
                            <span>&nbsp;</span>
                            <a
                              href="#"
                              className="flag-post-link"
                            >
                              flag
                            </a>*/}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <br />
      </div>
    );
  }
}

export default Comment;
