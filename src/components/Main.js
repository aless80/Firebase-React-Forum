import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../Firebase";

export const TRUNCATION_LIMIT = 150;

class Main extends Component {
  fire_posts = firebase.firestore().collection("posts");
  unsubscribe = null;
  state = {
    posts: []
  };

  onCollectionUpdate = querySnapshot => {
    const posts = [];
    querySnapshot.forEach(doc => {
      const { title, text, author, profilePicUrl, timestamp } = doc.data();
      posts.push({
        key: doc.id,
        //doc, // DocumentSnapshot
        title,
        text,
        author,
        profilePicUrl,
        timestamp
      });
    });
    this.setState({
      posts
    });
  };

  componentDidMount() {
    this.unsubscribe = this.fire_posts.onSnapshot(this.onCollectionUpdate);
  }

  addSizeToGoogleProfilePic(url) {
    if (!url) {
      console.error("Could not find picture url for post");
      return undefined;
    }
    if (
      url.indexOf("googleusercontent.com") !== -1 &&
      url.indexOf("?") === -1
    ) {
      return url + "?sz=150";
    }
    return url;
  }

  profilePicStyle(url) {
    return { backgroundImage: `url(${this.addSizeToGoogleProfilePic(url)})` };
  }

  // Helper methods about time
  getDateObject(firebaseTimeStamp) {
    if (!firebaseTimeStamp) return "";
    if (!firebaseTimeStamp) {
      console.error("Could not find firebaseTimeStamp for post");
      return undefined;
    }
    var dateObj = firebaseTimeStamp.toDate();
    return new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000);
  }
  getDateTime(dateObj) {
    function pad(n) {
      return n < 10 ? "0" + n : n;
    }
    return (
      pad(dateObj.getDate()) +
      "-" +
      pad(dateObj.getMonth()) +
      "-" +
      dateObj.getFullYear() +
      " " +
      pad(dateObj.getHours()) +
      ":" +
      pad(dateObj.getMinutes())
    );
  }
  timeDifference(previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerWeek = msPerDay * 7;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    const current = Date.now();
    var elapsed = current - previous;
    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + " seconds ago";
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + " minutes ago";
    } else if (elapsed < msPerHour * 2) {
      return Math.round(elapsed / msPerHour) + " hour ago";
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + " hours ago";
    } else if (elapsed < msPerDay * 2) {
      return Math.round(elapsed / msPerDay) + " day ago";
    } else if (elapsed < msPerWeek * 2) {
      return Math.round(elapsed / msPerDay) + " days ago";
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerWeek) + " weeks ago";
    } else if (elapsed < msPerMonth * 2) {
      return Math.round(elapsed / msPerMonth) + " month ago";
    } else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + " months ago";
    } /*else if (elapsed < msPerYear * 2) {
      return Math.round(elapsed / msPerYear) + " year ago";
    } else {
      return Math.round(elapsed / msPerYear) + " years ago";
    }*/ else {
      return this.getDateTime(previous);
    }
  }

  render() {
    return (
      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Posts</h3>
          </div>
          <div className="panel-body">
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
                          <Link to={`/show/${post.key}`} className="post-title">
                            {post.title}
                          </Link>
                        </td>
                        <td>{post.text}</td>
                        <td>{post.author}</td>
                        <td
                          title={this.getDateTime(
                            this.getDateObject(post.timestamp)
                          )}
                        >
                          {this.timeDifference(
                            this.getDateObject(post.timestamp)
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
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
