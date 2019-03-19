import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../Firebase";
import {
  truncate,
  getDateObject,
  getDateTime,
  timeDifference
} from "../Scripts/utilities";

export const TRUNCATION_LIMIT = 290;

class PostList extends Component {
  fire_posts = firebase
    .firestore()
    .collection("posts")
    .orderBy("timestamp");
  unsubscribe = null;
  state = {
    posts: [],
    isLoading: true
  };

  onCollectionUpdate = querySnapshot => {
    const posts = [];
    querySnapshot.forEach(doc => {
      posts.push({...doc.data(), key: doc.id})
    });
    this.setState({
      posts,
      isLoading: false
    });
  };

  componentDidMount() {
    //Get the posts now
    this.unsubscribe = this.fire_posts.onSnapshot(this.onCollectionUpdate);
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  profilePicStyle(url) {
    if (!url) {
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
              <div className="table-posts">
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Picture</th>
                      <th>Title</th>
                      <th>Text</th>
                      <th>Comments</th>
                      <th>Author</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.posts.length === 0 && (
                      <tr className="border-bottom-0">
                        <td>No posts</td>
                      </tr>
                    )}
                    {this.state.posts.length > 0 &&
                      this.state.posts.map((post, i) => 
                      (
                        <tr key={post.key} className={"alt" + ((i % 2) + 1)}>
                          <td
                            className="profile-pic"
                            style={this.profilePicStyle(post.profilePicUrl)}
                            title={post.author}
                          />
                          <td>
                            <Link
                              to={`/post/${post.key}`}
                              className="post-title"
                            >
                              {post.title}
                            </Link>
                          </td>
                          <td>{truncate(post.plainText, TRUNCATION_LIMIT)}</td>
                          <td>{post.comments-1}</td>
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
              {/*<button
                  onClick={() => 1}
                  className="btn btn-bgn ml-1"
                >
                  New Post
                </button>
                */}

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