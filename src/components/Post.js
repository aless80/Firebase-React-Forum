import React, { Component } from "react";
import { Link } from "react-router-dom";
import Reply from "./Reply";
import Comment from "./Comment";
import {
  invalidateComment,
  invalidatePost,
  getPost,
  getComment,
  fire_posts
} from "../Scripts/firebase";

class Post extends Component {
  state = {
    post: {},
    post_key: "",
    comment_array: [],
    showReply: false,
    isLoading: true,
    title: ""
  };
  //comment_array = [];
  unsubscribe = null;

  componentDidMount() {
    getComment(this.props.match.params.id, doc => {
      const comment_array = this.doc2array(doc.data());
      this.setState({...this.state, comment_array: comment_array})
    });
    getPost(this.props.match.params.id, doc => {
      // Set the state
      var data = {
        post: doc.data(),
        post_key: doc.id,
        isLoading: false
      };
      this.setState({ ...this.state, ...data });
      // Subscribe to updates of the post
      this.unsubscribe = fire_posts.doc(this.props.match.params.id).onSnapshot(this.onPostDocumentUpdate);
    });
  }

  // Keep comments' text and title up to date. 
  // This is achieved by having 1) the onSnapshot subscription above; 2) comment_array and title in state; 3) this callback modifying comment_array and title
  onPostDocumentUpdate = () => {
    // Update comments
    getComment(this.props.match.params.id, doc => {
      const comment_array = this.doc2array(doc.data());
      this.setState({...this.state, comment_array: comment_array })
    });
    // Update post title
    getPost(this.props.match.params.id, doc => {
      const post = doc.data()
      this.setState({ ...this.state.post, post: post })
    })
  };

  componentWillUnmount() {
    this.unsubscribe();
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
    invalidateComment(post_key, commentid);
    if (commentid === "1") {
      invalidatePost(post_key);
    }
    this.props.history.push(`/`);
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
    this.toggleShowReply();
  }

  toggleShowReply() {
    this.setState({ ...this.state, showReply: !this.state.showReply });
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
              {this.state.comment_array.map(comment => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  post_title={this.state.post.title}
                  post_key={this.state.post_key}
                  deleteCallback={this.deleteCallback}
                />
              ))}
              <div>
                {!this.state.showReply && (
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
          {this.state.showReply && (
            <Reply
              post_key={this.props.match.params.id}
              toggleShowReply={() => this.toggleShowReply()}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Post;
