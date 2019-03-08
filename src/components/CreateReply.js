import React, { Component } from "react";
//import ReactDOM from 'react-dom';
import firebase from "../Firebase";
import { Link } from "react-router-dom";

class CreateReply extends Component {
  fire_post = firebase
    .firestore()
    .collection("posts")
    .doc(this.props.post_key);
  fire_comment_coll = firebase.firestore().collection("comments");
  fire_comment = firebase
    .firestore()
    .collection("comments")
    .doc(this.props.post_key);
  state = {
    comment_key: "",
    post_key: "",
    text: ""
  };

  componentDidMount() {
    console.log("this.props:", this.props);
    this.fire_post.get().then(doc => {
      if (doc.exists) {
        this.setState({
          post: doc.data(),
          post_key: doc.id,
          comment_key: doc.data().comments + 1,
          text: "",
          isLoading: false
        });
        console.log("fire_post:", doc.id, doc.data());
        console.log("this.state:", this.state);
      } else {
        console.error("No such document!");
      }
    });
    //console.log("this.fire_comment_coll", this.fire_comment_coll);
    //console.log("this.fire_comment", this.fire_comment);
  }

  onSubmit = e => {
    e.preventDefault();
    const { post_key, comment_key, text } = this.state;
    var data = {
      author: this.getUserName(),
      profilePicUrl: this.getProfilePicUrl(),
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    //not working on fire_comment or fire_comment_coll
    //this.fire_comment_coll.FieldValue.arrayUnion(data)

    /*
    //Add collection. Works, one nesting (2nd document) too much
    this.fire_comment
      .collection(comment_key.toString())
      .add(data);
    */

    /*
    //Works but overwrites document
    var comment_obj = {}; // {1: {author: 'ale',.. }}
    comment_obj[comment_key] = data;
    this.fire_comment
      .set(comment_obj)
      .then(docRef => {
        //this.props.history.push("/");
        console.log("success");
      })
      .catch(error => {
        console.error("Error adding comment document: ", error);
      });*/

    // Get document with all comments, push new comment, save document
    this.fire_comment
      .get()
      .then(doc => {
        var document = doc.data();
        if (!document) document = {};
        document[comment_key] = data;
        this.fire_comment.set(document).catch(error => {
          console.error("Error on setting document: ", error);
        });
      })
      .catch(error => {
        console.error("Error on getting document: ", error);
        return;
      });

    // Update number of comments in post collection
    this.fire_post
      .update({ comments: this.state.comment_key })
      .then(docRef => {
        console.log("success");
      })
      .catch(error => {
        console.error("Error updating post document: ", error);
      });

    //TODO close post, or reload
  };

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

  render() {
    const { text } = this.state;
    return (
      <div className="panel panel-default">
        <div className="panel-heading" />
        <div className="panel-body">
          <form onSubmit={this.onSubmit}>
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
            </div>
            <div>
              <button type="submit" className="btn btn-dark">
                Submit
              </button>
              <button
                type="submit"
                className="btn btn-dark ml-1"
                onClick={() => this.props.toggleShowComment()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default CreateReply;
