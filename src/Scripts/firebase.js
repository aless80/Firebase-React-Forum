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
export const profilePicStyle = (url, style = {}) => {
  if (!url) {
    return undefined;
  }
  if (url.indexOf("googleusercontent.com") !== -1 && url.indexOf("?") === -1) {
    url = url + "?sz=150";
  }
  style["backgroundImage"] = `url(${url})`;
  return style;
};

/**
 * Get the current timestamp from firebase server
 *
 * @return {Timestamp} - firebase timestamp
 */
export const getServerTimestamp = () => {
  return firebase.firestore.FieldValue.serverTimestamp();
};

/**
 * Signs-in in Firebase using popup auth and Google as the identity provider
 */
export const signIn = () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
};

/**
 * Signs-out of application.
 */
export const signOut = () => {
  // Sign out of Firebase.
  firebase.auth().signOut();
};

/*
// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}
*/

/**
 * CRUD operations
 *
 */

/**
 * Get the post collection
 * @type {firebase.firestore.DocumentReference}
 */
export const fire_posts = firebase.firestore().collection("posts");

/**
 * Get the comment collection
 * @type {firebase.firestore.CollectionReference}
 */
export const fire_comments = firebase.firestore().collection("comments");

/**
 * Get a post document and optionally run a callback on it
 *
 * @param {string} post_key - The post id
 * @callback [onGetDocument] - Function to be called when comment document is successfully retrieved
 */
export const getPost = (post_key, onGetDocument) => {
  fire_posts
    .doc(post_key)
    .get()
    .then(doc => {
      if (doc.exists) {
        if (onGetDocument) {
          onGetDocument(doc);
        }
      } else {
        console.error("No such Post document");
      }
    });
};

/**
 * Get a comment document and optionally run a callback on it
 *
 * @param {string} post_key - The post id
 * @callback [onGetDocument] - Function to be called when comment document is successfully retrieved
 */
export const getComment = (post_key, onGetDocument) => {
  fire_comments
    .doc(post_key)
    .get()
    .then(doc => {
      if (doc.exists) {
        if (onGetDocument) {
          onGetDocument(doc);
        }
      } else {
        console.error("No such Comment document");
      }
    })
    .catch(error => {
      console.error("Error on getting comment: ", error);
      return;
    });
};

/**
 * Add a user's comment (i.e. a map in the Comment document) at position comment_key
 *
 * @param {string} post_key - The post id
 * @param {number} comment_key - The comment key
 * @param {object} data_comment
 */
export const pushComment = (post_key, comment_key, data) => {
  const fire_comment_doc = fire_comments.doc(post_key);
  fire_comment_doc.get().then(doc => {
    var document = doc.data();
    if (!document) document = {};
    document[comment_key] = data;
    fire_comment_doc
      .set(document)
      .catch(error => {
        console.error("Error on setting comment document: ", error);
      });
  });
};

/**
 * Update a Post in firebase
 *
 * @param {string} post_key - The post id
 * @param {object} data_post - Object with key-value pairs to edit in the post document
 * @callback [onAfterupdate] - Function to be called after a successfull update. No document available
 */
export const updatePost = (post_key, data_post, onAfterUpdate) => {
  const fire_post_doc = fire_posts.doc(post_key);
  fire_post_doc
    .get()
    .then(doc0 => {
      fire_post_doc
        .update({ ...doc0.data(), ...data_post })
        .then(() => {
          /* NB: no document available */
          if (onAfterUpdate) {
            onAfterUpdate();
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
 * Update a comment document
 *
 * @param {string} post_key - The post id
 * @param {string} commentid - The comment key
 * @param {object} data_comment - Object with key-value pairs to edit in the comment document
 */
export const updateComment = (
  post_key,
  commentid,
  data_comment
) => {
  const fire_comment_doc = fire_comments.doc(post_key);
  fire_comment_doc
    .get()
    .then(doc0 => {
      var document = { ...doc0.data() };
      document[commentid] = { ...document[commentid], ...data_comment };
      fire_comment_doc
        .set(document)
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
    lastEdit: firebase.firestore.FieldValue.serverTimestamp()
    //title: ""
    //timestamp: timestamp
  };
  updatePost(post_key, data_post, onAfterupdate);
};
