import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  truncate,
  getDateObject,
  getDateTime,
  timeDifference
} from "../Scripts/utilities";
import { fire_posts, profilePicStyle } from "../Scripts/firebase";

export const TRUNCATION_LIMIT = 290;

class PostList extends Component {
  unsubscribe = null;
  state = {
    posts: [],
    sortBy: "",
    direction: "",
    isLoading: true
  };

  componentDidMount() {
    // Trigger componentDidUpdate
    this.setState({ ...this.state, sortBy: "timestamp", direction: "desc" });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //Get the posts now and subscribe to updates
    if (
      this.state.sortBy !== prevState.sortBy ||
      this.state.direction !== prevState.direction
    ) {
      this.unsubscribe = fire_posts
        .orderBy(this.state.sortBy, this.state.direction)
        .limit(300)
        .onSnapshot(this.onPostsCollectionUpdate);
    }
  }

  onPostsCollectionUpdate = querySnapshot => {
    const posts = [];
    querySnapshot.forEach(doc => {
      posts.push({ ...doc.data(), key: doc.id });
    });
    this.setState({ ...this.state, posts, isLoading: false });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  onDoubleClickHeader(event) {
    event.stopPropagation();
    // Block event on <span>
    if (event.target.tagName !== "TH") return;
    // Set sortBy and direction in state based on previous state and what was clicked
    let targetname = event.target.attributes.name.nodeValue;
    let direction = "desc";
    if (this.state.sortBy === targetname) {
      direction = this.state.direction === "desc" ? "asc" : "desc";
    }
    this.setState({ ...this.state, sortBy: targetname, direction });
  }

  renderSorting(targetname) {
    if (this.state.sortBy !== targetname) {
      return "";
    }
    return this.state.direction === "desc" ? "\u00A0\u25B4" : "\u00A0\u25BE";
  }

  render() {
    const { isLoading } = this.state;
    return (
      <div className="container">
        <div className="panel panel-default">
          <br />
          <div className="panel-heading">
            <h3 className="panel-title">Posts</h3>
          </div>
          <br />
          <div className="panel-body">
            {isLoading && <div className="spinner" />}
            {!isLoading && (
              <div className="tablePosts">
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Picture</th>
                      <th
                        name="title"
                        onDoubleClick={event => this.onDoubleClickHeader(event)}
                      >
                        Title
                        <span>{decodeURI(this.renderSorting("title"))}</span>
                      </th>
                      <th
                        name="plainText"
                        onDoubleClick={event => this.onDoubleClickHeader(event)}
                      >
                        Text
                        <span>
                          {decodeURI(this.renderSorting("plainText"))}
                        </span>
                      </th>
                      <th
                        name="comments"
                        onDoubleClick={event => this.onDoubleClickHeader(event)}
                      >
                        Comments
                        <span>{decodeURI(this.renderSorting("comments"))}</span>
                      </th>
                      <th
                        name="author"
                        onDoubleClick={event => this.onDoubleClickHeader(event)}
                      >
                        Author
                        <span>{decodeURI(this.renderSorting("author"))}</span>
                      </th>
                      <th
                        name="timestamp"
                        onDoubleClick={event => this.onDoubleClickHeader(event)}
                      >
                        Created
                        <span>
                          {decodeURI(this.renderSorting("timestamp"))}
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.posts.length === 0 && (
                      <tr className="border-bottom-0">
                        <td>No posts</td>
                      </tr>
                    )}
                    {this.state.posts.length > 0 &&
                      this.state.posts.map((post, i) => (
                        <tr key={post.key} className={"alt" + ((i % 2) + 1)}>
                          {post.profilePicUrl ? (
                            <td>
                              <div
                                className="profilePic"
                                style={profilePicStyle(post.profilePicUrl)}
                                title={post.author}
                              />
                            </td>
                          ) : (
                            <td>
                              <div
                                className="material-icons md-36 profilePic"
                                title="The author deleted this post"
                              >
                                account_circle
                              </div>
                            </td>
                          )}
                          <td>
                            <Link
                              to={`/post/${post.key}`}
                              className="postTitle"
                            >
                              {post.title}
                            </Link>
                          </td>
                          <td>{truncate(post.plainText, TRUNCATION_LIMIT)}</td>
                          <td>{post.comments - 1}</td>
                          <td>{post.author}</td>
                          <td
                            title={getDateTime(getDateObject(post.timestamp))}
                          >
                            {timeDifference(getDateObject(post.timestamp))}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            <div>
              <br />
              <Link to="/create" className="btn btn-bgn">
                New Post
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PostList;
