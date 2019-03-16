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

class Main extends Component {
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
      const { title, plainText, author, profilePicUrl, timestamp } = doc.data();
      posts.push({
        key: doc.id,
        title,
        plainText,
        author,
        profilePicUrl,
        timestamp
      });
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
      //console.error("Could not find picture url for post");
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

  // TODO: with one single post the picture goes out of table
  // TODO: bad css when "No posts": hover changes color and green border on bottom
  render() {
    const { isLoading } = this.state;
    return (
      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Posts</h3>
          </div>
          <div className="panel-body">
          {isLoading && (
                <div className="spinner" /> // render null when app is not ready
              )}
              {!isLoading && (
            <div className="table-posts">
              
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Picture</th>
                      <th>Title</th>
                      <th>Text</th>
                      <th>Author</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.posts.length === 0 && (
                      <tr>
                        <td>No posts</td>
                      </tr>
                    )}
                    {this.state.posts.length > 0 &&
                      this.state.posts.map((post, i) => (
                        <tr key={post.key} className={"alt" + ((i % 2) + 1)}>
                          <td
                            className="profile-pic"
                            style={this.profilePicStyle(post.profilePicUrl)}
                            title={post.author}
                          />
                          <td>
                            <Link
                              to={`/show/${post.key}`}
                              className="post-title"
                            >
                              {post.title}
                            </Link>
                          </td>
                          <td>{truncate(post.plainText, TRUNCATION_LIMIT)}</td>
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
              
            </div>)}
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

export default Main;
