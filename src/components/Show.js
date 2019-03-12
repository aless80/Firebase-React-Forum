import React, { Component } from "react";
import firebase from "../Firebase";
import { Link } from "react-router-dom";
import Reply from "./Reply";
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
    //const state = this.state;
    this.toggleShowComment();
    //this.setState(state);
  }

  toggleShowComment() {
    const state = this.state;
    state["showComment"] = !state["showComment"];
    this.setState(state);
  }

  render() {
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
              <Comment
                key="0"
                comment2={this.state.post}
                comment={{...this.state.post, ...{'id':0}}}
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

export default Show;
