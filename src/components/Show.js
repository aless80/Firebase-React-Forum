import React, { Component } from "react";
import firebase from "../Firebase";
import { Link } from "react-router-dom";
import CreateReply from "./CreateReply";
import Comment from "./Comment";

class Show extends Component {
  state = {
    post: {},
    post_key: "",
    showComment: false
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
  delete(id) {
    firebase
      .firestore()
      .collection("posts")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        this.props.history.push("/");
      })
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  }*/

  reply(id) {
    //const state = this.state;
    this.toggleShowComment();
    //this.setState(state);
  }

  toggleShowComment() {
    const state = this.state;
    state["showComment"] = !state["showComment"];
    this.setState(state);
  }

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

  render() {
    return (
      <div className="container">
        <div className="panel panel-default">
          <br />
          <div className="panel-heading">
            <Link to="/" className="btn btn-default pl-0 border">
              &lt;&lt; Back to Post List
            </Link>
            <br />
            <br />
          </div>
          <div className="panel-body">
            <Comment
              key="0"
              comment={this.state.post}
              post_title={this.state.post.title}
            />
            {this.comment_array.map(comment => (
              <Comment
                key={comment.id}
                comment={comment}
                post_title={this.state.post.title}
              />
            ))}
            <div>
              {!this.state.showComment && (
                <button
                  onClick={() => this.reply(this.state.key)}
                  className="btn btn-dark ml-1"
                >
                  Reply
                </button>
              )}
            </div>
          </div>
          <div className="panel-footer" />
        </div>
        <br />

        {this.state.showComment && (
          <CreateReply
            post_key={this.props.match.params.id}
            toggleShowComment={() => this.toggleShowComment()}
          />
        )}
      </div>
    );
  }
}

export default Show;
