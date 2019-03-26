import React, { Component } from "react";
import {
  getDateObject,
  getDateTime,
  timeDifference
} from "../Scripts/utilities";
import { Link } from "react-router-dom";
import { getUserName, profilePicStyle } from "../Scripts/firebase";

class Comment extends Component {
  delete() {
    const res = window.confirm("Do you really want to remove this comment?");
    if (!res) {
      return;
    }
    this.props.deleteCallback(this.props.post_key, this.props.comment.id);
  }

  render() {
    const imageStyle = {
      /* Override layout of user picture */
      top: "0px",
      width: "30px",
      height: "30px",
      backgroundSize: "30px",
      borderRadius: "15px",
      marginLeft: "0px",
      padding: "0.0rem",
      fontSize: "32px"
    };
    return (
      <div align="center">
        <div className="commentpage text-left w-100">
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
                      <div id={"postmenu-" + this.props.comment.id}>
                        <div className="font-weight-strong">
                          {this.props.comment.author ? (
                            <strong>{this.props.comment.author}</strong>
                          ) : (
                            <strong>&nbsp;</strong>
                          )}
                        </div>
                      </div>

                      {this.props.comment.profilePicUrl ? (
                        <div
                          className="profilePic"
                          style={profilePicStyle(
                            this.props.comment.profilePicUrl,
                            imageStyle
                          )}
                          title={this.props.comment.author}
                        />
                      ) : (
                        <div
                          className="material-icons md-42 profilePic"
                          style={imageStyle}
                          title="The author deleted this comment"
                        >
                          account_circle
                        </div>
                      )}

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
                      id={"td-post-" + this.props.comment.id}
                    >
                      <div
                        className="postRichText"
                        id={"postRichText-" + this.props.comment.id}
                        dangerouslySetInnerHTML={{
                          __html: this.props.comment.richText
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      className={"alt" + ((this.props.comment.id % 2) + 1)}
                      width="175"
                    />
                    <td
                      className={
                        "alt" +
                        ((this.props.comment.id % 2) + 1) +
                        " border relative"
                      }
                      id={"td-menu-" + this.props.comment.id}
                    >
                      {this.props.comment.author === getUserName() && (
                        <div className="postmenu small text-muted bottom-right">
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
                          <button
                            type="button"
                            className="link-button"
                            onClick={() => this.delete()}
                          >
                            delete
                          </button>
                        </div>
                      )}
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
