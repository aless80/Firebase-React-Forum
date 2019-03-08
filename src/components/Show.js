import React, { Component } from "react";
import firebase from "../Firebase";
import { Link } from "react-router-dom";
import CreateReply from "./CreateReply";
import Comment from "./Comment";

class Show extends Component {
  state = {
    post: {},
    key: "",
    showComment: false
  };

  componentDidMount() {
    const fire_post = firebase
      .firestore()
      .collection("posts")
      .doc(this.props.match.params.id);
    fire_post.get().then(doc => {
      if (doc.exists) {
        this.setState({
          post: doc.data(),
          key: doc.id,
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
    console.log("toggleShowComment");
    const state = this.state;
    state["showComment"] = !state["showComment"];
    this.setState(state);
  }

  getComments() {
    return [{ id: 1, text: "a" }, { id: 2, text: "b" }];
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
            <h2 className="panel-title">{this.state.post.title}</h2>
          </div>
          <div className="panel-body">
            {this.getComments().map(comment => (
              /*<p key={comment.id}>{comment.text}</p>*/
              <Comment key={comment.id} text={comment.text}/>
            ))}

            <div>{this.state.post.text}</div>
            <div>{this.state.post.author}</div>

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
