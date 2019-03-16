import React, { Component } from "react";
import firebase from "../Firebase";
import { Link } from "react-router-dom";
import TextEditor from "./TextEditor";

class Create extends Component {
  state = {
    title: ""
  };
  fire_posts = firebase.firestore().collection("posts");
  fire_comment_coll = firebase
    .firestore()
    .collection("comments")
    //.doc(this.props.post_key);
  refEditor = React.createRef();
  initialRichText = "<p></p>" // this is rich text (I mean a string with HTML code)

  // Change title
  onChangeTitle = e => {
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
    console.log('this.refEditor.current.state:', this.refEditor.current.state)
    var richText = this.refEditor.current.state.valueHtml;
    var plainText = this.refEditor.current.state.plainText;
    const { title } = this.state;
    //this.setState({ ...this.state, richText: richText, plainText: plainText });
    // Send to Firebase
    e.preventDefault();
    console.log('this.state:', this.state)
    
    var author = this.getUserName();
    var profilePicUrl = this.getProfilePicUrl();
    this.fire_posts
      .add({
        author: author,
        comments: 1,
        profilePicUrl: profilePicUrl,
        title: title,
        plainText: plainText,
        richText: richText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(docRef => {



        var post_key = docRef.id
        var data = {
          author: author,
          profilePicUrl: this.getProfilePicUrl(),
          plainText: plainText,
          richText: richText,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        // Get document with all comments, push new comment, save document
        var fire_comment = this.fire_comment_coll
          .doc(post_key);
        fire_comment.get()
          .then(doc => {
            console.log('fire_comment get doc:', doc)
            var document = doc.data();
            if (!document) document = {};

            // Save post's rich text as comment number 1
            document["1"] = data;
            fire_comment.set(document)/*.then(doc => {
              console.log('fire_comment set doc:', doc)
            })*/
            .catch(error => {
              console.error("Error on setting document: ", error);
            });
    
          })
          .catch(error => {
            console.error("Error on getting document: ", error);
            return;
        });
        this.setState({
          title: "",
        });
        // TODO
        this.props.history.push("/");
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
  };

  render() {
    //const { title, plainText, richText } = this.state;
    const { title } = this.state;
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
                  onChange={this.onChangeTitle}
                  placeholder="Title"
                />
              </div>
              <div className="form-group">
                <div className="border border-dark">
                  <TextEditor ref={this.refEditor} initialRichText={this.initialRichText} />
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
