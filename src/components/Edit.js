import React, { Component } from "react";
import firebase from "../Firebase";
import { Link } from "react-router-dom";
import TextEditor from "./TextEditor";

class Edit extends Component {
  state = {
    title: "",
    plainText: "",
    richText: ""
  };

  fire_comment = firebase
    .firestore()
    .collection("comments")
    .doc(this.props.match.params.postkey);
  refEditor = React.createRef();

  postkey = this.props.match.params.postkey;
  commentid = this.props.match.params.commentid;
  editingPost = this.props.match.params.commentid === "1";

  componentDidMount() {
    if (this.editingPost) {
      this.fire_post = firebase
        .firestore()
        .collection("posts")
        .doc(this.props.match.params.postkey);
      this.fire_post.get().then(doc => {
        if (doc.exists) {
          const post = doc.data();
          this.setState({ ...this.state, title: post.title });
        } else {
          console.log("No such Post document!");
        }
      });
    }
    this.fire_comment
      .get()
      .then(doc => {
        this.setState({
          ...this.state,
          plainText: doc.data()[this.props.match.params.commentid].plainText,
          richText: doc.data()[this.props.match.params.commentid].richText
        });
      })
      .catch(error => {
        console.error("Error on getting comment: ", error);
        return;
      });
  }

  // Change title
  onChangeTitle = e => {
    const state = { ...this.state };
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  onSubmit = e => {
    // Get the rich text (I mean a string with HTML code) from the reference to TextEditor
    var richText = this.refEditor.current.state.valueHtml;
    //var plainText = this.refEditor.current.state.plainText;
    // Send to Firebase
    e.preventDefault();
    // Get document with all comments, push new comment
    const data_comment = {
      richText: richText,
      last_edit: firebase.firestore.FieldValue.serverTimestamp()
    };
    this.updateComment(
      this.fire_comment,
      this.props.match.params.commentid,
      data_comment
    );

    if (this.editingPost) {
      const { title } = this.state;
      const plainText = this.refEditor.current.state.plainText;
      const data_post = {
        title: title,
        plainText: plainText,
        last_edit: firebase.firestore.FieldValue.serverTimestamp()
      };
      this.updatePost(this.fire_post, data_post);
    }
    // Go back to post
    this.setState({
      title: "aa",
      plainText: "",
      richText: ""
    });
    //TODO: does not refresh after editing
    this.props.history.push("/post/" + this.props.match.params.postkey);
  };

  updatePost(fire_post_doc, data_post) {
    fire_post_doc
      .get()
      .then(doc => {
        fire_post_doc.update({ ...doc.data(), ...data_post }).catch(error => {
          console.error("Error updating post document: ", error);
        });
      })
      .catch(error => {
        console.error("Error getting a post: ", error);
      });
  }

  // Push a new comment to firebase
  updateComment(fire_comment_doc, id, data) {
    fire_comment_doc
      .get()
      .then(doc => {
        var document = { ...doc.data() };
        document[id] = { ...document[id], ...data };
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
    return (
      <div className="container">
        <div className="panel panel-default">
          <br />
          <div className="panel-heading">
            {this.editingPost && <h3 className="panel-title">Edit Post</h3>}
            {!this.editingPost && <h3 className="panel-title">Edit Comment</h3>}
          </div>
          <br />
          <div className="panel-body">
            <form onSubmit={this.onSubmit}>
              {this.editingPost && (
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={this.state.title}
                    onChange={this.onChangeTitle}
                    placeholder="Title"
                  />
                </div>
              )}
              <div className="form-group">
                <div className="border border-dark">
                  <TextEditor
                    ref={this.refEditor}
                    initialRichText={this.state.richText}
                  />
                </div>
              </div>
              <div>
                <button type="submit" className="btn btn-bgn">
                  Submit
                </button>
                <Link
                  to={`/post/${this.props.match.params.postkey}`}
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
