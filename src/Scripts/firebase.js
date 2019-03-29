import firebase from "../Firebase";

/**
 * Cloud Storage
 *
 * @return {Object}
 */
export const storage = firebase.storage();

/**
 * Store file to path in Firebase Storage
 *
 * @param {String} storagePath - Path in Firebase storage where the file gets stored, e.g. the post_key
 * @param {File} file - The file as a File object
 * @param {UploadMetadata} metadata - Metadata for the newly uploaded object
 * @callback [onUploadProgress] - Callback on upload progress triggering when the file is being uploading.
 * @callback [onSuccessfulUpload] - Callback on the file URL triggering when the file is successfully uploaded
 * @callback [onError] - Callback on error message and object triggering when the upload encounters an error
 */
export const uploadToStorage = (
  storagePath,
  file,
  metadata = {},
  onUploadProgress = p => {},
  onSuccessfulUpload = (msg, url) => {},
  onError = err => {}
) => {
  var ref = storage.ref(storagePath).child(file.name);
  // Example for metadata
  /*var metadata = {
    contentType: 'image/jpeg',
    customMetadata: {timestamp: <somedate>}
  };*/
  var uploadTask = ref.put(file, metadata);
  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion

  uploadTask.on(
    "state_changed",
    snapshot => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var uploadProgress =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onUploadProgress(uploadProgress);
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          break;
        default:
          break;
      }
    },
    error => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      let msg = "";
      switch (error.code) {
        case "storage/unauthorized":
          msg =
            error.code +
            " error: user does not have permission to access the object. Make sure the size fo the file is less than 1MB";
          break;
        case "storage/canceled":
          msg = error.code + " error: user canceled the upload";
          break;
        case "storage/unknown":
          msg =
            error.code +
            " error: unknown error occurred, inspect error.serverResponse";
          break;
        default:
          msg =
            error.code +
            " error: unknown error occurred, inspect error.serverResponse";
          break;
      }
      onError(msg, error);
      //Unsubscribe after error
      uploadTask();
    },
    complete => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
        onSuccessfulUpload(downloadURL);
      });
      //Unsubscribe after complete
      uploadTask();
    }
  );
  return uploadTask;
};

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

/* CRUD and other operations on Comments and Posts collections in Firebase Database */

/**
 * Get the post collection
 * @type {firebase.firestore.DocumentReference}
 */
export const fire_posts = firebase.firestore().collection("posts");

/**
 * Get the number of documents in the Posts collection. Should work fine for small (<100) collections.
 * See https://stackoverflow.com/questions/46554091/firebase-firestore-collection-count/49407570
 *
 * @callback [onCommentSnapshot] - Callback on a query snapshot (e.g. use .size, .empty, .forEach) triggering when results are retrieved for the Comments collection
 */
export const postQuerySnapshot = onCommentSnapshot => {
  return fire_posts.get().then(snap => {
    onCommentSnapshot(snap);
  });
};

/**
 * Get the comment collection
 * @type {firebase.firestore.CollectionReference}
 */
export const fire_comments = firebase.firestore().collection("comments");

/**
 * Get a DocumentReference to a post. It can be used to populate properties such as id and path before actually saving the post
 *
 * @return {DocumentReference} - A reference to a document in firebase firestore
 */
export const getPostReference = () => {
  var fire_post = fire_posts.doc();
  return fire_post;
};

/**
 *
 * @param {*} fire_post - An existing DocumentReference to a Post
 * @param {*} data_post - The Post data to be set
 * @callback [onSetDocument] - Callback triggering when Comment document is successfully set
 */
export const setPostReference = (
  fire_post,
  data_post,
  onSetDocument = () => {}
) => {
  fire_post.set(data_post).then(() => {
    onSetDocument();
  });
};

/**
 * Get a post document and optionally run a callback on it
 *
 * @param {string} post_key - The post id
 * @callback [onGetDocument] - Callback on a document triggering when comment document is successfully retrieved
 */
export const getPost = (post_key, onGetDocument = () => {}) => {
  fire_posts
    .doc(post_key)
    .get()
    .then(doc => {
      if (doc.exists) {
        onGetDocument(doc);
      } else {
        console.error("No such Post document");
      }
    });
};

/**
 * Get a comment document and optionally run a callback on it
 *
 * @param {string} post_key - The post id
 * @callback [onGetDocument] - Callback on a document triggering comment document is successfully retrieved
 */
export const getComment = (post_key, onGetDocument = () => {}) => {
  fire_comments
    .doc(post_key)
    .get()
    .then(doc => {
      if (doc.exists) {
        onGetDocument(doc);
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
 * @callback [onSetDocument] - Callback triggering on a successful update of the Comment document
 */
export const pushComment = (
  post_key,
  comment_key,
  data,
  onSetDocument = () => {}
) => {
  const fire_comment_doc = fire_comments.doc(post_key);
  fire_comment_doc.get().then(doc => {
    var document = doc.data();
    if (!document) document = {};
    document[comment_key] = data;
    fire_comment_doc
      .set(document)
      .then(onSetDocument())
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
 * @callback [onAfterupdate] - Callback triggering after a successfull update. No document available
 */
export const updatePost = (post_key, data_post, onAfterUpdate = () => {}) => {
  const fire_post_doc = fire_posts.doc(post_key);
  fire_post_doc
    .get()
    .then(doc0 => {
      fire_post_doc
        .update({ ...doc0.data(), ...data_post })
        .then(() => {
          /* NB: no document available */
          onAfterUpdate();
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
 * @callback [onAfterSetDocument] - Callback triggering on a successful write of the Comment document (e.g. window.location.reload())
 */
export const updateComment = (
  post_key,
  commentid,
  data_comment,
  onAfterSetDocument = () => {}
) => {
  const fire_comment_doc = fire_comments.doc(post_key);
  fire_comment_doc
    .get()
    .then(doc0 => {
      var document = { ...doc0.data() };
      document[commentid] = { ...document[commentid], ...data_comment };
      fire_comment_doc
        .set(document)
        .then(onAfterSetDocument())
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
 * @callback [onAfterSetDocument] - Callback triggering on a successful write of the Comment document (e.g. window.location.reload())
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
 * @callback [onAfterupdate] - Callback triggering on a successful update of the Post document (e.g. window.location.reload())
 */
export const invalidatePost = (post_key, onAfterupdate) => {
  const data_post = {
    author: "",
    comments: 1,
    profilePicUrl: "",
    plainText: "Post deleted",
    status: "closed",
    lastEdit: firebase.firestore.FieldValue.serverTimestamp()
    //title: ""
    //timestamp: timestamp
  };
  updatePost(post_key, data_post, onAfterupdate);
};
