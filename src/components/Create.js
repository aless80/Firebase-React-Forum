import React, { Component } from "react";
import PropTypes from 'prop-types';
import firebase from "../Firebase";
import { Link } from "react-router-dom";
import TextEditor from "./TextEditor";
import { getUserName, getProfilePicUrl } from "../Scripts/firebaseCRUD"

class Create extends Component {
  state = {
    title: "Post title"
  };
  fire_posts = firebase.firestore().collection("posts");
  fire_comments = firebase.firestore().collection("comments");
  //.doc(this.props.post_key);
  refEditor = React.createRef();
  initialRichText = "<p></p>"; // this is rich text (I mean a string with HTML code)

  // Change title
  onChangeTitle = e => {
    const state = { ...this.state };
    state[e.target.name] = e.target.value;
    this.setState(state);
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
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    this.fire_posts
      .add({
        author: author,
        comments: 1,
        profilePicUrl: profilePicUrl,
        title: title,
        plainText: plainText,
        richText: richText,
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
        var fire_comment = this.fire_comments.doc(post_key);
        this.addComment(fire_comment, 1, data);
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

  // Push a new comment to firebase
  addComment(fire_comment_doc, id, data) {
    fire_comment_doc
      .get()
      .then(doc => {
        var document = doc.data();
        if (!document) document = {};
        document[id] = data;
        fire_comment_doc.set(document).catch(error => {
          console.error("Error on setting comment: ", error);
        });
      })
      .catch(error => {
        console.error("Error on getting comment: ", error);
        return;
      });
  }

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

Create.propTypes = {
  ref: PropTypes.array.isRequired,
  initialRichText: PropTypes.string.isRequired,
}
export default Create;
