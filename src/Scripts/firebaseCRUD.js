import firebase from "../Firebase";

/**
 * @type {firebase.firestore.DocumentReference}
 */
const fire_posts = firebase.firestore().collection("posts");

/**
 * @type {firebase.firestore.CollectionReference}
 */
const fire_comments = firebase.firestore().collection("comments");

/**
 * Get a comment document and run a callback on it
 *
 * @param {} post_key - The post id
 * @param {*} commentid - The comment key
 * @callback - Function to be called when comment document (doc) is successfully retrieved
 */
export const getComment = (post_key, commentid, callback) => {
  fire_comments
    .doc(post_key)
    .get()
    .then(doc => {
      if (callback) {
        callback(doc);
      }
    })
    .catch(error => {
      console.error("Error on getting comment: ", error);
      return;
    });
};

/**
 * Update a comment document
 *
 * @param {string} post_key - The post id
 * @param {string} commentid - The comment key
 * @param {object} data_comment - Object with key-value pairs to edit in the comment document
 * @callback [callback] - Function to be called when comment document (doc) is successfully updated
 */
export const updateComment = (post_key, commentid, data_comment, callback) => {
  const fire_comment_doc = fire_comments.doc(post_key);
  fire_comment_doc
    .get()
    .then(doc0 => {
      var document = { ...doc0.data() };
      document[commentid] = { ...document[commentid], ...data_comment };
      fire_comment_doc
        .set(document)
        .then(doc => {
          if (callback) {
            callback(doc);
          }
        })
        .catch(error => {
          console.error("Error on setting comment: ", error);
        });
    })
    .catch(error => {
      console.error("Error on getting comment: ", error);
      return;
    });
};

/**
 * This is not a real delete, but a function that deletes the text, username, etc of a user comment (i.e. a key of a comment document)
 *
 * @param {string} post_key - The post id
 * @param {string} commentid - The comment key
 * @callback [callback] - Function to be called on a successful delete (e.g. window.location.reload())
 */
export const deleteComment = (post_key, commentid, callback) => {
  const data_comment = {
    author: "",
    comments: 1,
    profilePicUrl: "",
    plainText: "Comment deleted",
    richText: "<blockquote>Comment deleted</blockquote>",
    lastEdit: firebase.firestore.FieldValue.serverTimestamp()
    //timestamp: timestamp
  };
  updateComment(post_key, commentid, data_comment, callback);
};

/**
 * Update a Post in firebase
 *
 * @param {string} post_key - The post id
 * @param {object} data_post - Object with key-value pairs to edit in the post document
 * @callback [callback] - Function to be called on a successful update
 */
export const updatePost = (post_key, data_post, callback) => {
  const fire_post_doc = fire_posts.doc(post_key);
  fire_post_doc
    .get()
    .then(doc0 => {
      fire_post_doc
        .update({ ...doc0.data(), ...data_post })
        .then(doc => {
          if (callback) {
            callback();
          }
        })
        .catch(error => {
          console.error("Error updating post document: ", error);
        });
    })
    .catch(error => {
      console.error("Error getting a post: ", error);
    });
};
