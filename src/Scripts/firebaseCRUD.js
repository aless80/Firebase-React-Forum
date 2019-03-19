import firebase from "../Firebase";

/**
 * Return the signed-in user's display name.
 *
 * @return {string}
 */
export const getUserName = () => {
  return firebase.auth().currentUser.displayName;
};

/**
 * Return the signed-in user's profile Pic URL.
 * 
 * @return {string}
 */
export const getProfilePicUrl = () => {
  return (
    firebase.auth().currentUser.photoURL || "/images/profile_placeholder.png"
  );
};

/**
 * Return a style for the picture
 * 
 * @param {string} url 
 * @param {object} [style] - object with additional style formatted for react
 * @return {object}
 */
export const profilePicStyle = (url , style={}) => {
  if (!url) {
    return undefined;
  }
  if (
    url.indexOf("googleusercontent.com") !== -1 &&
    url.indexOf("?") === -1
  ) {
    url = url + "?sz=150";
  }
  style['backgroundImage'] = `url(${url})`;
  return style;
}

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
 * @callback onGetDocument - Function to be called when comment document (doc) is successfully retrieved
 */
export const getComment = (post_key, commentid, onGetDocument) => {
  fire_comments
    .doc(post_key)
    .get()
    .then(doc => {
      if (onGetDocument) {
        onGetDocument(doc);
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
 * @callback [onAfterSetDocument] - Function to be called when comment document (doc) is successfully updated
 */
export const updateComment = (
  post_key,
  commentid,
  data_comment,
  onAfterSetDocument
) => {
  const fire_comment_doc = fire_comments.doc(post_key);
  fire_comment_doc
    .get()
    .then(doc0 => {
      var document = { ...doc0.data() };
      document[commentid] = { ...document[commentid], ...data_comment };
      fire_comment_doc
        .set(document)
        .then(doc => {
          if (onAfterSetDocument) {
            onAfterSetDocument(doc);
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
 * Update a Post in firebase
 *
 * @param {string} post_key - The post id
 * @param {object} data_post - Object with key-value pairs to edit in the post document
 * @callback [onAfterupdate] - Function to be called on a successful update
 */
export const updatePost = (post_key, data_post, onAfterupdate) => {
  const fire_post_doc = fire_posts.doc(post_key);
  fire_post_doc
    .get()
    .then(doc0 => {
      fire_post_doc
        .update({ ...doc0.data(), ...data_post })
        .then(doc => {
          if (onAfterupdate) {
            onAfterupdate();
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

/**
 * Delete text, username, etc of a user's comment (i.e. a key of a comment document)
 *
 * @param {string} post_key - The post id
 * @param {string} commentid - The comment key
 * @callback [onAfterSetDocument] - Function to be called on a successful delete (e.g. window.location.reload())
 */
export const invalidateComment = (post_key, commentid, onAfterSetDocument) => {
  const data_comment = {
    author: "",
    comments: 1,
    profilePicUrl: "",
    plainText: "Comment deleted",
    richText: "<blockquote>Comment deleted</blockquote>",
    lastEdit: firebase.firestore.FieldValue.serverTimestamp()
    //timestamp: timestamp
  };
  updateComment(post_key, commentid, data_comment, onAfterSetDocument);
};

/**
 * Delete text, username, etc of a user's post document
 *
 * @param {string} post_key - The post id
 * @callback [callback] - Function to be called on a successful delete (e.g. window.location.reload())
 */
export const invalidatePost = (post_key, onAfterupdate) => {
  const data_post = {
    author: "",
    comments: 1,
    profilePicUrl: "",
    plainText: "Post deleted",
    lastEdit: firebase.firestore.FieldValue.serverTimestamp(),
    richText: "<blockquote>Comment deleted</blockquote>"
    //title: ""
    //timestamp: timestamp
  };
  updatePost(post_key, data_post, onAfterupdate);
};
