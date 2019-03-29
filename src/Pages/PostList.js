import React, { Component } from "react";
import { Link } from "react-router-dom";
import Pagination from "../Components/Pagination";
import {
  truncate,
  getDateObject,
  getDateTime,
  timeDifference
} from "../Scripts/utilities";
import {
  fire_posts,
  profilePicStyle,
  postQuerySnapshot
} from "../Scripts/firebase";

export const TRUNCATION_LIMIT = 290;
export const PAGE_SIZE = 20;

class PostList extends Component {
  state = {
    posts: [],
    sortBy: "timestamp",
    direction: "desc",
    isLoading: true,
    currentPage: undefined
  };
  pagesCount = 0;
  dataSetSize = undefined;
  unsubscribe = null;

  componentDidMount() {
    // Get the total number of posts for the page count, run initial query
    postQuerySnapshot(snap => {
      this.dataSetSize = snap.size;
      this.pagesCount = Math.ceil(this.dataSetSize / PAGE_SIZE);
      // Trigger componentDidUpdate
      this.setState({ ...this.state, currentPage: 0 });
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //Get the posts now and subscribe to updates
    if (
      this.state.sortBy !== prevState.sortBy ||
      this.state.direction !== prevState.direction ||
      this.state.currentPage !== prevState.currentPage
    ) {
      this.unsubscribe = fire_posts
        .orderBy(this.state.sortBy, this.state.direction)
        .limit(this.state.currentPage * PAGE_SIZE + PAGE_SIZE)
        .onSnapshot(this.onPostsCollectionUpdate);
    }
  }

  onPostsCollectionUpdate = querySnapshot => {
    // Get the posts from the QuerySnapshot
    const posts = [];
    querySnapshot.forEach(doc => {
      posts.push({ ...doc.data(), key: doc.id });
    });
    // Write to state
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
    this.setState({
      ...this.state,
      isLoading: true,
      sortBy: targetname,
      direction
    });
  }

  renderSorting(targetname) {
    if (this.state.sortBy !== targetname) {
      return "";
    }
    return this.state.direction === "desc" ? "\u00A0\u25B4" : "\u00A0\u25BE";
  }

  pageClick(event, page) {
    event.preventDefault();
    this.setState({ ...this.state, isLoading: true, currentPage: page });
  }

  render() {
    const { isLoading, currentPage, posts } = this.state;
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
              <div>
                <div className="tablePosts">
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <th>Picture</th>
                        <th
                          name="title"
                          onDoubleClick={event =>
                            this.onDoubleClickHeader(event)
                          }
                        >
                          Title
                          <span>{decodeURI(this.renderSorting("title"))}</span>
                        </th>
                        <th
                          name="plainText"
                          onDoubleClick={event =>
                            this.onDoubleClickHeader(event)
                          }
                        >
                          Text
                          <span>
                            {decodeURI(this.renderSorting("plainText"))}
                          </span>
                        </th>
                        <th
                          name="comments"
                          onDoubleClick={event =>
                            this.onDoubleClickHeader(event)
                          }
                        >
                          Comments
                          <span>
                            {decodeURI(this.renderSorting("comments"))}
                          </span>
                        </th>
                        <th
                          name="author"
                          onDoubleClick={event =>
                            this.onDoubleClickHeader(event)
                          }
                        >
                          Author
                          <span>{decodeURI(this.renderSorting("author"))}</span>
                        </th>
                        <th
                          name="status"
                          onDoubleClick={event =>
                            this.onDoubleClickHeader(event)
                          }
                        >
                          Status
                          <span>{decodeURI(this.renderSorting("status"))}</span>
                        </th>
                        <th
                          name="timestamp"
                          onDoubleClick={event =>
                            this.onDoubleClickHeader(event)
                          }
                        >
                          Created
                          <span>
                            {decodeURI(this.renderSorting("timestamp"))}
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.length === 0 && (
                        <tr className="border-bottom-0">
                          <td>No posts</td>
                        </tr>
                      )}
                      {posts.length > 0 &&
                        posts
                          .slice(
                            currentPage * PAGE_SIZE,
                            (currentPage + 1) * PAGE_SIZE
                          )
                          .map((post, i) => (
                            <tr
                              key={post.key}
                              className={"alt" + ((i % 2) + 1)}
                            >
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
                              <td>
                                {truncate(post.plainText, TRUNCATION_LIMIT)}
                              </td>
                              <td>{post.comments - 1}</td>
                              <td>{post.author}</td>
                              <td>{post.status}</td>
                              <td
                                title={getDateTime(
                                  getDateObject(post.timestamp)
                                )}
                              >
                                {timeDifference(getDateObject(post.timestamp))}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={this.state.currentPage}
                  pagesCount={this.pagesCount}
                  handlePageClick={(event, page) => this.pageClick(event, page)}
                />
              </div>
            )}
            <div>
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
