import React, { Component } from "react";
import firebase from "../Firebase";
import { Link } from "react-router-dom";
import Reply from "./Reply";
import Comment from "./Comment";
import {deleteComment} from "../Scripts/firebaseCRUD";

class Post extends Component {
  state = {
    post: {},
    post_key: "",
    showComment: false,
    isLoading: true
  };

  fire_comment = firebase
    .firestore()
    .collection("comments")
    .doc(this.props.match.params.id);

  fire_post = firebase
    .firestore()
    .collection("posts")
    .doc(this.props.match.params.id);

  comment_array = [];

  componentDidMount() {
    this.fire_comment.get().then(doc => {
      if (doc.exists) {
        this.comment_array = this.doc2array(doc.data());
      } else {
        console.log("No such document!");
      }
    });
    this.fire_post.get().then(doc => {
      if (doc.exists) {
        // Set the state
        this.setState({
          post: doc.data(),
          post_key: doc.id,
          isLoading: false
        });
      } else {
        console.log("No such document!");
      }
    });
  }

  /*
  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate')
    if (this.props !== prevProps) {
      console.log('prevProps:', prevProps)
      console.log('this.props:', this.props)
    }
    if (this.state.post.lastEdit !== prevState.lastEdit) {
      console.log('prevState:', prevState)
      console.log('this.state:', this.state)
      //this.setState()
    }
  }*/

  deleteCallback = (post_key, commentid) => {
    console.log("deleteCallback(post_key, commentid):", post_key, commentid);
    deleteComment(post_key, commentid);
    this.props.history.push(`/`);
    //, window.location.reload()
  };

  doc2array(comment_array) {
    var array = [];
    for (const key in comment_array) {
      var out = {};
      out = comment_array[key];
      out["id"] = key;
      array.push(out);
    }
    return array;
  }

  reply(id) {
    this.toggleShowComment();
  }

  toggleShowComment() {
    const state = { ...this.state };
    state["showComment"] = !state["showComment"];
    this.setState(state);
  }

  render() {
    const { isLoading } = this.state;
    return (
      <div className="container">
        <div>
          <div className="panel panel-default">
            <br />
            <div className="panel-heading">
              <Link to="/">
                <button className="btn btn-bgn ml-0">
                  &lt;&lt; Back to Post List
                </button>
              </Link>
              <br />
              <br />
            </div>
            <div className="panel-body">
              {isLoading && <div className="spinner" />}
              {this.comment_array.map(comment => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  post_title={this.state.post.title}
                  post_key={this.state.post_key}
                  deleteCallback={this.deleteCallback}
                />
              ))}
              <div>
                {!this.state.showComment && (
                  <button
                    onClick={() => this.reply(this.state.key)}
                    className="btn btn-bgn ml-0"
                  >
                    Reply
                  </button>
                )}
              </div>
            </div>
            <div className="panel-footer" />
          </div>
        </div>
        <br />
        <div>
          {this.state.showComment && (
            <Reply
              post_key={this.props.match.params.id}
              toggleShowComment={() => this.toggleShowComment()}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Post;
