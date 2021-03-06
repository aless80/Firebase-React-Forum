import React, { Component } from "react";
import { Link } from "react-router-dom";
import TextEditor from "./TextEditor/TextEditor";
import {
  fire_posts,
  getPost,
  getComment,
  getServerTimestamp,
  updatePost,
  updateComment
} from "../Scripts/firebase";

class Edit extends Component {
  state = {
    title: "",
    plainText: "",
    richText: "",
    post_key: this.props.match.params.postkey
  };
  refEditor = React.createRef();
  editingPost = this.props.match.params.commentid === "1";

  componentDidMount() {
    if (this.editingPost) {
      this.fire_post = fire_posts.doc(this.props.match.params.postkey);
      getPost(this.props.match.params.postkey, doc => {
        const post = doc.data();
        this.setState({ ...this.state, title: post.title });
      });
    }

    getComment(this.props.match.params.postkey, doc => {
      this.setState({
        ...this.state,
        plainText: doc.data()[this.props.match.params.commentid].plainText,
        richText: doc.data()[this.props.match.params.commentid].richText
      });
    });
  }

  // Change title
  onChangeTitle = e => {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    // Get the rich text (I mean a string with HTML code) from the reference to TextEditor
    var plainText = this.refEditor.current.state.plainText;
    var richText = this.refEditor.current.state.valueHtml;
    //var plainText = this.refEditor.current.state.plainText;
    // Send to Firebase
    e.preventDefault();
    // Get document with all comments, push new comment
    const data_comment = {
      plainText: plainText,
      richText: richText,
      lastEdit: getServerTimestamp()
    };
    updateComment(
      this.props.match.params.postkey,
      this.props.match.params.commentid,
      data_comment
    );

    if (this.editingPost) {
      const { title } = this.state;
      const plainText = this.refEditor.current.state.plainText;
      const data_post = {
        plainText: plainText,
        title: title,
        lastEdit: getServerTimestamp()
      };
      updatePost(this.props.match.params.postkey, data_post);
    }
    // Go back to post
    this.setState({
      title: "",
      plainText: "",
      richText: ""
    });
    this.props.history.push("/post/" + this.props.match.params.postkey);
  };

  render() {
    const { title, post_key, richText } = this.state;
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
                    value={title}
                    onChange={this.onChangeTitle}
                    placeholder="Title"
                  />
                </div>
              )}
              <div className="form-group">
                <div className="border border-dark">
                  <TextEditor
                    ref={this.refEditor}
                    post_key={post_key}
                    initialRichText={richText}
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
