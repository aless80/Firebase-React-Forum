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
    return {
      backgroundImage: `url(${url})`,
      /* Override size */
      top: "0px",
      width: "30px",
      height: "30px",
      backgroundSize: "30px",
      borderRadius: "15px",
      marginLeft: "0px",
      padding: "0.0rem"
    };
  }
  render() {
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
                        {this.props.comment.id > 0 && "Re:"}{" "}
                        {this.props.post_title}{" "}
                      </span>
                      {this.props.comment.id > 0 && (
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
                      className={"alt" + ((this.props.comment.id % 2) + 1)}
                      width="175"
                    >
                      <div id={"postmenu_" + this.props.comment.id}>
                        <div className="font-weight-strong">
                          <strong>{this.props.comment.author}</strong>
                        </div>
                      </div>
                      <div
                        className="profile-pic"
                        style={this.profilePicStyle(
                          this.props.comment.profilePicUrl
                        )}
                        title={this.props.comment.author}
                      />
                      {/*<div className="small text-muted">
                          <br />
                          <div>Registered: </div>
                          <div>Latest activity: </div>
                          Need Admin SDK in priviledge environment
                          https://firebase.google.com/docs/admin/setup                          
                        </div>*/}
                    </td>
                    <td
                      className={
                        "alt" +
                        ((this.props.comment.id % 2) + 1) +
                        " border relative"
                      }
                      id={"td_post_" + this.props.comment.id}
                    >
                      <div id={"post_message_" + this.props.comment.id} dangerouslySetInnerHTML={{ __html: this.props.comment.richText }}>
                      </div>

                      <div className="post-menu small text-muted bottom-right">
                        <a
                          href={"/posts/" + this.props.comment.id + "/edit"}
                          className="suggest-edit-post"
                        >
                          edit
                        </a>
                        {/*<span>&nbsp;</span>
                          <a
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
