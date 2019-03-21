import React, { Component } from "react";
import TextEditor from "./TextEditor";
import {
  fire_comments,
  getUserName,
  getProfilePicUrl,
  getServerTimestamp,
  getPost,
  updatePost,
  pushComment
} from "../Scripts/firebase";

class Reply extends Component {
  state = {
    comment_key: ""
  };
  fire_comment = fire_comments.doc(this.props.post_key);
  refEditor = React.createRef();
  initialRichText = "<p></p>"; // this is rich text (I mean a string with HTML code)

  componentDidMount() {
    getPost(this.props.post_key, doc => {
      this.setState({
        post: doc.data(),
        post_key: doc.id,
        comment_key: doc.data().comments + 1,
        richText: "",
        isLoading: false
      });
    });
  }

  onSubmit = e => {
    e.preventDefault();
    const { comment_key } = this.state;
    var richText = this.refEditor.current.state.valueHtml;
    var plainText = this.refEditor.current.state.plainText;
    if (plainText === "" || richText === "") {
      alert("Text cannot be empty");
      e.preventDefault();
      return
    }
    const timestamp = getServerTimestamp();
    var data = {
      author: getUserName(),
      plainText: plainText,
      profilePicUrl: getProfilePicUrl(),
      richText: richText,
      lastEdit: timestamp,
      timestamp: timestamp
    };

    /*
    //not working on fire_comment
    //fire_comments.doc(this.props.post_key).FieldValue.arrayUnion(data)
    
    //Add collection. Works, one nesting (2nd document) too much
    fire_comments.doc(this.props.post_key)
      .collection(comment_key.toString())
      .add(data);

    //Works but overwrites document
    var comment_obj = {}; // {1: {author: 'ale',.. }}
    comment_obj[comment_key] = data;
    fire_comments.doc(this.props.post_key)
      .set(comment_obj)
      .then(docRef => {
        //this.props.history.push("/");
        console.log("success");
      })
      .catch(error => {
        console.error("Error adding comment document: ", error);
      });

    //This is what works and is what I am using in pushComment below
    fire_comments.doc(this.props.post_key)
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
      */

    pushComment(this.props.post_key, comment_key, data);

    // Update number of comments in post collection
    updatePost(
      this.props.post_key,
      { comments: this.state.comment_key },
      () => {
        // Close Reply menu
        this.props.toggleShowReply();
        // Can I refresh <Comment> children in Show? Well, reload the page
        window.location.reload();
      }
    );
  };

  /*onChange = e => {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  };*/

  render() {
    //const { richText } = this.state;
    return (
      <div className="panel panel-default">
        <div className="panel-heading" />
        <div className="panel-body">
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <div className="border border-dark">
                <TextEditor
                  autoFocus
                  ref={this.refEditor}
                  initialRichText={this.initialRichText}
                />
              </div>
            </div>
            <div>
              <button type="submit" className="btn btn-bgn">
                Submit
              </button>
              <button
                type="submit"
                className="btn btn-bgn ml-1"
                onClick={() => this.props.toggleShowReply()}
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

export default Reply;
