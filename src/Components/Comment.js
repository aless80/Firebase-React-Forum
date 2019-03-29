import React, { Component } from "react";
import {
  getDateObject,
  getDateTime,
  timeDifference
} from "../Scripts/utilities";
import CommentMenu from "./CommentMenu";
import { profilePicStyle } from "../Scripts/firebase";

class Comment extends Component {
  toggleCloseCallback = () => {
    this.props.toggleCloseCallback(this.props.post_key);
  };

  deleteCallback = () => {
    this.props.deleteCallback(this.props.post_key, this.props.comment.id);
  };

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
    let comment = this.props.comment;
    let post_title = this.props.post_title;
    let post_status = this.props.post_status;
    let post_key = this.props.post_key;
    return (
      <div align="center">
        <div className="commentpage text-left w-100">
          <div className="p-0" align="left">
            <div id={"edit" + comment.id} className="p-0">
              <table
                id={"post" + comment.id}
                className="tborder w-100 align-middle"
                cellSpacing="0"
                cellPadding="3"
              >
                <thead>
                  <tr>
                    <th
                      className="thead font-weight-light border border-right-0"
                      title={getDateTime(
                        getDateObject(comment.timestamp)
                      )}
                    />
                    <th className="thead font-weight-strong border border-left-0">
                      <span className="text-left">
                        {comment.id > 0 && "Re:"}{" "}
                        {post_title}{" "}
                        {post_status === "closed" && "[POST CLOSED]"}
                      </span>
                      {comment.id > 0 && (
                        <span className="float-right">
                          &nbsp; #
                          <a
                            href={"#reply" + comment.id}
                            rel="nofollow"
                            id={"reply" + comment.id}
                            name={comment.id}
                          >
                            <strong>{comment.id}</strong>
                          </a>
                        </span>
                      )}{" "}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="align-top">
                    <td
                      className={"alt" + ((comment.id % 2) + 1)}
                      width="175"
                    >
                      <div id={"postmenu-" + comment.id}>
                        <div className="font-weight-strong">
                          {comment.author ? (
                            <strong>{comment.author}</strong>
                          ) : (
                            <strong>&nbsp;</strong>
                          )}
                        </div>
                      </div>

                      {comment.profilePicUrl ? (
                        <div
                          className="profilePic"
                          style={profilePicStyle(
                            comment.profilePicUrl,
                            imageStyle
                          )}
                          title={comment.author}
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
                            getDateObject(comment.timestamp)
                          )}
                        >
                          Posted:
                          {timeDifference(
                            getDateObject(comment.timestamp)
                          )}
                        </div>
                        {+getDateObject(comment.timestamp) !==
                          +getDateObject(comment.lastEdit) && (
                          <div
                            title={getDateTime(
                              getDateObject(comment.lastEdit)
                            )}
                          >
                            Modified:{" "}
                            {timeDifference(
                              getDateObject(comment.lastEdit)
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    <td
                      className={
                        "alt" +
                        ((comment.id % 2) + 1) +
                        " border relative"
                      }
                      id={"td-post-" + comment.id}
                    >
                      <div
                        className="postRichText"
                        id={"postRichText-" + comment.id}
                        dangerouslySetInnerHTML={{
                          __html: comment.richText
                        }}
                      />
                    </td>
                  </tr>
                  
                  <tr>
                    <td
                      className={"alt" + ((comment.id % 2) + 1)}
                      width="175"
                    />
                    <td
                      className={
                        "alt" +
                        ((comment.id % 2) + 1) +
                        " border relative"
                      }
                      id={"td-menu-" + comment.id}
                    >
                      <CommentMenu
                        comment_id={comment.id}
                        author={comment.author}
                        post_key={post_key}
                        post_status={post_status}
                        deleteCallback={this.deleteCallback}
                        toggleCloseCallback={this.toggleCloseCallback}
                      />
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
