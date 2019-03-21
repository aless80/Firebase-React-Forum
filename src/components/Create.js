import React, { Component } from "react";
import { Link } from "react-router-dom";
import TextEditor from "./TextEditor";
import { getUserName, getProfilePicUrl } from "../Scripts/firebase";
import {
  fire_posts,
  pushComment,
  getServerTimestamp
} from "../Scripts/firebase";

class Create extends Component {
  state = {
    title: "Post title"
  };

  //.doc(this.props.post_key);
  refEditor = React.createRef();
  initialRichText = "<p></p>"; // this is rich text (I mean a string with HTML code)

  // Change title
  onChangeTitle = e => {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    // Get the rich text (I mean a string with HTML code) from the reference to TextEditor
    var richText = this.refEditor.current.state.valueHtml;
    var plainText = this.refEditor.current.state.plainText;
    const { title } = this.state;
    // Send to Firebase
    e.preventDefault();
    var author = getUserName();
    var profilePicUrl = getProfilePicUrl();
    const timestamp = getServerTimestamp();
    fire_posts
      .add({
        author: author,
        comments: 1,
        profilePicUrl: profilePicUrl,
        title: title,
        plainText: plainText,
        lastEdit: timestamp,
        timestamp: timestamp
      })
      .then(docRef => {
        var post_key = docRef.id;
        var data = {
          author: author,
          profilePicUrl: getProfilePicUrl(),
          plainText: plainText,
          richText: richText,
          lastEdit: timestamp,
          timestamp: timestamp
        };
        // Get document with all comments, push new comment
        pushComment(post_key, 1, data);
        this.setState({
          title: ""
        });
        // Go back to root
        this.props.history.push("/");
      })
      .catch(error => {
        console.error("Error adding Post: ", error);
      });
  };

  render() {
    //const { title, plainText, richText } = this.state;
    const { title } = this.state;
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
