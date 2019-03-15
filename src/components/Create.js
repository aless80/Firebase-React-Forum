import React, { Component } from "react";
import firebase from "../Firebase";
import { Link } from "react-router-dom";
import TextEditor from "./TextEditor";

class Create extends Component {
  fire_posts = firebase.firestore().collection("posts");
  state = {
    title: "",
    text: "",
    richText: ""
  };
  refEditor = React.createRef();

  // Change title
  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  // Returns the signed-in user's display name.
  getUserName() {
    return firebase.auth().currentUser.displayName;
  }

  // Returns the signed-in user's profile Pic URL.
  getProfilePicUrl() {
    return (
      firebase.auth().currentUser.photoURL || "/images/profile_placeholder.png"
    );
  }
  
  onSubmit = e => {
    // Get the rich text (I mean a string with HTML code) from the reference to TextEditor
    var richText = this.refEditor.current.state.valueHtml;
    this.setState({...this.state, richText: richText})
    // Send to Firebase
    e.preventDefault();
    const { title, text } = this.state;
    var author = this.getUserName();
    this.fire_posts
      .add({
        author: author,
        comments: 0,
        profilePicUrl: this.getProfilePicUrl(),
        title: title,
        text: text,
        richText: richText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(docRef => {
        this.setState({
          title: "",
          text: "",
          richText: richText
        });
        // TODO
        this.props.history.push("/");
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
  };


  render() {
    const { title, text, richText } = this.state;
    return (
      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">New Post</h3>
          </div>
          <div className="panel-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={title}
                  onChange={this.onChange}
                  placeholder="Title"
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  name="text"
                  onChange={this.onChange}
                  placeholder="Your text"
                  cols="80"
                  rows="4"
                  value={text}
                />

                <br />
                <div className="border border-dark">
                  <TextEditor ref={this.refEditor} initialValue={richText} />
                </div>
              </div>
              <div>
                <button type="submit" className="btn btn-bgn">
                  Submit
                </button>
                <Link to="/" className="btn btn-bgn ml-1">
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

export default Create;
