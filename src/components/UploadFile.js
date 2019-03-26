import { Block } from "slate";
import imageExtensions from "image-extensions";
import { storage, uploadToStorage } from "../Scripts/firebase";


/**
 * A function to determine whether a URL has an image extension.
 *
 * @param {String} url
 * @return {Boolean}
 */
export const isImage = url => {
  return imageExtensions.includes(getExtension(url));
};

/**
 * Get the extension of the URL, using the URL API.
 *
 * @param {String} url
 * @return {String}
 */
export const getExtension = url => {
  return new URL(url).pathname.split(".").pop();
};

/**
 * A change function to standardize inserting images.
 *
 * @param {Editor} editor
 * @param {String} src
 * @param {Range} target
 */
export const insertImage = (editor, src, target) => {
  console.log("insertImage");
  console.log("editor, src, target:", editor, src, target);
  if (target) {
    editor.select(target);
  }
  editor.insertBlock({
    type: "image",
    data: { src: src }
  });
};

/**
 * The editor's schema.
 *
 * @type {Object}
 */
export const schema = {
  document: {
    last: { type: "paragraph" },
    normalize: (editor, { code, node, child }) => {
      console.log("schema node:", node);
      switch (code) {
        case "last_child_type_invalid": {
          const paragraph = Block.create("paragraph");
          return editor.insertNodeByKey(node.key, node.nodes.size, paragraph);
        }
        default:
          console.error("Default case in TextEditor > schema");
      }
    }
  },
  blocks: {
    image: {
      isVoid: true
    }
  }
};

/**
 * On clicking the image button, prompt for an image and insert it.
 *
 * @param {Event} event
 */
export const onClickImage = event => {
  event.preventDefault();
  const src = window.prompt("Enter the URL of the image:");
  if (!src) return;
  this.editor.command(insertImage, src);
};

/**
 * On drop, insert the image wherever it is dropped.
 *
 * @param {Event} event
 * @param {Editor} editor
 * @param {Function} next
 *
export const onDropOrPaste = (event, editor, next) => {
  const target = getEventRange(event, editor);
  if (!target && event.type === "drop") return next();
  const transfer = getEventTransfer(event);
  const { type, text, files } = transfer;
  if (type === "files") {
    for (const file of files) {
      const reader = new FileReader();
      const [mime] = file.type.split("/");
      if (mime !== "image") continue;
      const callback = src => {
        editor.insertBlock({
          type: "image",
          data: { src }
        });
      };
      reader.addEventListener("load", () => {
        //editor.command(this.insertImage, reader.result, target);
        editor.command(this.insertImage2Firebase, target, file, callback);
      });
      reader.readAsDataURL(file);
    }
    return;
  }
  if (type === "text") {
    if (!isUrl(text)) return next();
    if (!isImage(text)) return next();
    editor.command(insertImage, text, target);
    return;
  }

  next();
};

/**
 * A change function to standardize inserting images.
 *
 * @param {Editor} editor
 * @param {String} src
 * @param {Range} target
 * @param {String} filename
 */
export const insertImage2Firebase = (editor, target, file, callback) => {
  if (target) {
    editor.select(target);
  }
  /*uploadToStorage(src, filename, callback)*/
  var ref = storage.ref("images").child(file.name);
  var uploadTask = ref.put(file);
  uploadTask.then(snapshot => {
    snapshot.ref.getDownloadURL().then(src => {
      console.log("src:", src); //https://firebasestorage.googleapis.com/v0/b/crud-aa17b.appspot.com/o/images%2F2017-12-06DS.jpg?alt=media&token=7d233aae-1eda-4d70-85c4-4cc689da3929
      callback(src);
    });
  });
};
