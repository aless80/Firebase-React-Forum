import React, { Component } from "react";
import "./Comment.css";

class Comment extends Component {
  render() {
    const hello = {
      flex: "1 1 100px"
    };
    return (
      <div>
        <div align="center">
          <div className="page text-left w-100">
            <div className="p-0" align="left">
              <div id="edit5971042" className="p-0">
                <table
                  id="post5971042"
                  className="tborder w-100 align-middle"
                  cellSpacing="0"
                  cellPadding="3"
                >
                  <thead>
                    <tr>
                      <th className="thead font-weight-light border border-right-0">
                        Yesterday, 09:42 PM
                      </th>
                      <th className="thead font-weight-strong border border-left-0">
                        <span className="text-left">Re: Some post title</span>
                        <span className="float-right">
                          &nbsp; #
                          <a
                            href="/questions/linux-newbie-8/chrome-browser-on-linux-mint-4175649625/#post5971042"
                            rel="nofollow"
                            id="postcount5971042"
                            name="7"
                          >
                            <strong>7</strong>
                          </a>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="align-top">
                      <td className="alt2 border" width="175">
                        <div id="postmenu_5971042">
                          <div className="font-weight-strong">Username</div>
                        </div>
                        <div className="small text-muted">
                          &nbsp;
                          <br />
                          <div>Registered: Mar 2019</div>
                        </div>
                      </td>
                      <td className="alt2 border" id="td_post_5971042">
                        <div id="post_message_5971042">
                          Some text Some text Some text Some text Some text Some
                          text Some text Some text Some text Some text Some text
                          Some text Some text Some text Some text Some text Some
                          text Some text Some text Some text Some text Some text
                        </div>

                        <div className="small text-muted" style={hello}>
                          <div className="post-menu">
                            <a
                              href="/posts/54687061/edit"
                              className="suggest-edit-post"
                            >
                              edit
                            </a>
                            <span>&nbsp;</span>
                            <a
                              href="#"
                              className="close-question-link"
                              data-questionid="54675211"
                              data-isclosed="false"
                            >
                              delete
                            </a>
                            <span>&nbsp;</span>
                            <a
                              href="#"
                              className="flag-post-link"
                              data-postid="54687061"
                            >
                              flag
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <hr />
      </div>
    );
  }
}

export default Comment;
