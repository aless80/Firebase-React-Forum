import React, { Component } from "react";
import {
  getDateObject,
  getDateTime,
  timeDifference
} from "../Scripts/utilities";
import { Link } from "react-router-dom";

class Comment extends Component {
  profilePicStyle(url) {
    if (!url) {
      //console.error("Could not find picture url for post");
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
  delete() {
    const res = window.confirm("Do you really want to remove this comment?");
    if (!res) {
      return;
    }
    this.props.deleteCallback(this.props.post_key, this.props.comment.id);

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
                    />
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
                      <div className="small text-muted">
                        <br />
                        <div
                          title={getDateTime(
                            getDateObject(this.props.comment.timestamp)
                          )}
                        >
                          Posted:
                          {timeDifference(
                            getDateObject(this.props.comment.timestamp)
                          )}
                        </div>
                        {+getDateObject(this.props.comment.timestamp) !==
                          +getDateObject(this.props.comment.lastEdit) && (
                          <div
                            title={getDateTime(
                              getDateObject(this.props.comment.lastEdit)
                            )}
                          >
                            Modified:{" "}
                            {timeDifference(
                              getDateObject(this.props.comment.lastEdit)
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td
                      className={
                        "alt" +
                        ((this.props.comment.id % 2) + 1) +
                        " border relative"
                      }
                      id={"td_post_" + this.props.comment.id}
                    >
                      <div
                        id={"post_message_" + this.props.comment.id}
                        dangerouslySetInnerHTML={{
                          __html: this.props.comment.richText
                        }}
                      />
                      <div className="post-menu small text-muted bottom-right">
                        <Link
                          to={
                            "/edit/" +
                            this.props.post_key +
                            "/" +
                            this.props.comment.id
                          }
                        >
                          edit
                        </Link>
                        <span>&nbsp;</span>
                        <a type="submit" onClick={() => this.delete()}>
                          delete
                        </a>
                        {/*<Link
                          to={
                            "/delete/" +
                            this.props.post_key +
                            "/" +
                            this.props.comment.id
                          }
                        >
                          delete
                        </Link>*/}
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
