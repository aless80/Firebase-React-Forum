import React, { Component } from "react";
import { Link } from "react-router-dom";
import TextEditor from "./TextEditor";
import { getUserName, getProfilePicUrl } from "../Scripts/firebase";
import {
  pushComment,
  getServerTimestamp,
  getPostReference,
  setPostReference
} from "../Scripts/firebase";

class Create extends Component {
  state = {
    title: "",
    post_key: ""
  };
  fire_post = getPostReference();
  refEditor = React.createRef();
  initialRichText = ""; // this is rich text (I mean a string with HTML code)

  componentDidMount() {
    //Create a reference to a new unsaved Post
    this.setState({ ...this.stat, post_key: this.fire_post.id });
  }
  // Change title
  onChangeTitle = e => {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    // Get the rich text (I mean a string with HTML code) from the reference to TextEditor
    var richText = this.refEditor.current.state.valueHtml;
    var plainText = this.refEditor.current.state.plainText;
    const { title } = this.state;
    if (title === "") {
      alert("Title cannot be empty");
      e.preventDefault();
      return;
    }
    if (plainText === "" || richText === "") {
      alert("Text cannot be empty");
      e.preventDefault();
      return;
    }
    // Send to Firebase
    e.preventDefault();
    var author = getUserName();
    var profilePicUrl = getProfilePicUrl();
    const timestamp = getServerTimestamp();
    const data_post = {
      author: author,
      comments: 1,
      plainText: plainText,
      profilePicUrl: profilePicUrl,
      status: "open",
      title: title,
      lastEdit: timestamp,
      timestamp: timestamp
    };
    const onSuccessfullySetDocument = () => {
      // Get document with all comments, push new comment
      var data_comment = {
        author: author,
        profilePicUrl: getProfilePicUrl(),
        plainText: plainText,
        richText: richText,
        lastEdit: timestamp,
        timestamp: timestamp
      };
      pushComment(this.state.post_key, 1, data_comment, () => {
        // Go back to post
        this.props.history.push("/post/" + this.state.post_key);
      });
    };
    setPostReference(this.fire_post, data_post, onSuccessfullySetDocument);
  };

  render() {
    const { title, post_key } = this.state;
    return (
      <div className="container">
        <div className="panel panel-default">
          <br />
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
                  onChange={this.onChangeTitle}
                  placeholder="Title"
                />
              </div>
              <div className="form-group">
                <div className="border border-dark">
                  <TextEditor
                    ref={this.refEditor}
                    post_key={post_key}
                    initialRichText={this.initialRichText}
                  />
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
