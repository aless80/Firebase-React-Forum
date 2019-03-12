import React, { Component } from "react";
import firebase from "../Firebase";
import { Link } from "react-router-dom";

class Edit extends Component {
  state = {
    key: "",
    title: "",
    text: ""
  };

  componentDidMount() {
    const fire_posts = firebase
      .firestore()
      .collection("posts")
      .doc(this.props.match.params.id);
    fire_posts.get().then(doc => {
      if (doc.exists) {
        const post = doc.data();
        this.setState({
          key: doc.id,
          title: post.title,
          text: post.text,
          author: post.author,
          profilePicUrl: post.profilePicUrl,
          timestamp: post.timestamp
        });
      } else {
        console.log("No such document!");
      }
    });
  }

  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState({ post: state });
  };

  onSubmit = e => {
    e.preventDefault();

    const { title, text } = this.state;

    const updateRef = firebase
      .firestore()
      .collection("posts")
      .doc(this.state.key);
    updateRef
      .update({
        title,
        text
      })
      .then(docRef => {
        this.setState({
          key: "",
          title: "",
          text: ""
        });
        this.props.history.push("/show/" + this.props.match.params.id);
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
  };

  render() {
    return (
      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Edit Post</h3>
          </div>
          <div className="panel-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  placeholder="Title"
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  name="text"
                  onChange={this.onChange}
                  placeholder="Text"
                  cols="80"
                  rows="4"
                  value={this.state.text}
                />
              </div>
              <div>
                <button type="submit" className="btn btn-bgn">
                  Submit
                </button>
                <Link
                  to={`/show/${this.state.key}`}
                  className="btn btn-bgn ml-1"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Edit;
