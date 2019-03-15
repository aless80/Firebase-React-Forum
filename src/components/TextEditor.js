import { Editor } from "slate-react";
import { Value } from "slate";

import React from "react";
//import initialValue from "./value.json";
import { isKeyHotkey } from "is-hotkey";
import { Button, Icon, Toolbar } from "../components";
//import Plain from 'slate-plain-serializer'
// Serialize to html
import Html from "slate-html-serializer";

const rules = [
  {
    /* deserialize == convert DOM to Slate model*/
    deserialize(el, next) {
      const BLOCK_TAGS = {
        blockquote: "quote",
        p: "paragraph",
        pre: "code",
        ul: "bulleted-list",
        h1: "heading-one",
        h2: "heading-two",
        li: "list-item",
        ol: "numbered-list"
      };
      /* TODO if useful handle attributes as in renderNode below eg
        return <blockquote {...attributes}>{children}</blockquote>; */
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];
console.log('deserialize type:', type)
      if (type) {
        return {
          object: "block",
          type: type,
          data: { className: el.getAttribute("class") },
          nodes: next(el.childNodes)
        };
      }
    },

    /* serialize == convert Slate model to DOM*/
    serialize(obj, children) {
      if (obj.object === "block") {
console.log('serialize obj.type:', obj.type)
        switch (obj.type) {
          case "code":
            return (
              <pre>
                <code>{children}</code>
              </pre>
            );
          case "paragraph":
            return <p className={obj.data.get("className")}>{children}</p>;
          case "block-quote":
            return <blockquote>{children}</blockquote>;
          default:
            console.error('serialize block on default case. obj.type=',obj.type)
        }
      }
    }
  },
  {
    deserialize(el, next) {
      // Add a dictionary of mark tags.
      const MARK_TAGS = {
        em: "italic",
        strong: "bold",
        u: "underline"
      };
      const type = MARK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        return {
          object: "mark",
          type: type,
          nodes: next(el.childNodes)
        };
      }
    },
    /* TODO rendermark below uses attributes as well: 
      return <code {...attributes}>{children}</code>;*/
    serialize(obj, children) {
      if (obj.object === "mark") {
        switch (obj.type) {
          case "bold":
            return <strong>{children}</strong>;
          case "italic":
            return <em>{children}</em>;
          case "underline":
            return <u>{children}</u>;
          default:
            console.error('serialize mark on default case. obj.type=',obj.type)
        }
      }
    }
  }
];
// Create a new serializer instance with our `rules` from above.
const html = new Html({ rules });
//
//
//


class TextEditor extends React.Component {
  /**
   * On change, save the new `value`.
   *
   * @param {Editor} editor
   */
  onChange = ({ value }) => {
    //console.log('Plain.serialize(value): ', Plain.serialize(value))
    //if (value.document != this.state.value.document) {
    //console.log('value.document is a mess:', value.document)
    
    // Print Slate json
    console.log('JSON.stringify(value.toJSON()): ',JSON.stringify(value.toJSON(), null, 4))
    // Show HTML of serialized Slate json
    var valueHtml = html.serialize(this.state.value)
    console.log('valueHtml:', valueHtml)
    // Set state
    this.setState({ value, valueHtml });
    
    html.deserialize("<p>try deserialize</p>")
    console.log("html.deserialize",html.deserialize("<p>try deserialize</p>"))
    //}
  };

  // Deserialize (convert HTML string to Slate object) initialValue prop from parent
  initialValue = html.deserialize(this.props.initialValue);

  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */
  state = {
    value: Value.fromJSON(this.initialValue),
    valueHtml: html.serialize(Value.fromJSON(this.initialValue))
  };

  /**
   * Store a reference to the `editor`.
   *
   * @param {Editor} editor
   */
  ref = editor => {
    this.editor = editor;
  };

  render() {
    return (
      <div>
        <div className="resizable">
          <Toolbar>
            {/*   renderMarkButton(type, icon) --> <Button> with <Icon>*/}
            {this.renderMarkButton("bold", "format_bold")}
            {this.renderMarkButton("italic", "format_italic")}
            {this.renderMarkButton("underlined", "format_underlined")}
            {this.renderBlockButton("code", "code")}
            {this.renderBlockButton("heading-one", "looks_one")}
            {this.renderBlockButton("heading-two", "looks_two")}
            {this.renderBlockButton("block-quote", "format_quote")}
            {this.renderBlockButton("numbered-list", "format_list_numbered")}
            {this.renderBlockButton("bulleted-list", "format_list_bulleted")}
          </Toolbar>
          <Editor
            spellCheck
            autoFocus
            placeholder="Enter some rich text..."
            ref={this.ref}
            value={this.state.value}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            renderMark={this.renderMark}
            renderNode={this.renderNode} /* eg return <li ..> for mark.type == "list-item" */
          />
          
        </div>
        <div className="resizable grippie bbr-sm mr-0"></div>
      </div>
    );
  }

/*componentWillReceiveProps(props) {
  const { parentProp } = this.props;
  if (this.props.parentProp !== parentProp) {
  console.log('------------this.props.parentProp:', this.props)
  }
}*/

  /**
   * On key down, if it is a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @return {Change}
   */
  onKeyDown = (event, editor, next) => {
    let mark;
    const isBoldHotkey = isKeyHotkey("mod+b");
    const isItalicHotkey = isKeyHotkey("mod+i");
    const isUnderlinedHotkey = isKeyHotkey("mod+u");
    const isCodeHotkey = isKeyHotkey("mod+`");
    if (isBoldHotkey(event)) {
      mark = "bold";
    } else if (isItalicHotkey(event)) {
      mark = "italic";
    } else if (isUnderlinedHotkey(event)) {
      mark = "underlined";
    } else if (isCodeHotkey(event)) {
      mark = "code";
    } else {
      return next();
    }
    event.preventDefault();
    editor.toggleMark(mark);
  };

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */
  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;
    switch (mark.type) {
      case "bold":
        return <strong {...attributes}>{children}</strong>;
      case "italic":
        return <em {...attributes}>{children}</em>;
      case "underlined":
        return <u {...attributes}>{children}</u>;
      default:
        return next();
    }
  };

  /**
   * Deserialize: Render a Slate node/block.
   *
   * @param {Object} props
   * @return {Element}
   */
  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props;
    switch (node.type) {
      case "code":
        return <code {...attributes}>{children}</code>;
      case "block-quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "heading-one":
        return <h1 {...attributes}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes}>{children}</h2>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      default:
        return next();
    }
  };

  /**
   * Render (return HTML for icons) a block-toggling toolbar button
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */
  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type);
    if (["numbered-list", "bulleted-list"].includes(type)) {
      const {
        value: { document, blocks }
      } = this.state;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = this.hasBlock("list-item") && parent && parent.type === type;
      }
    }
    return (
      //{active={isActive}}
      <Button onMouseDown={event => this.onClickBlockBtn(event, type)}>
        <Icon title={type}>{icon}</Icon>
      </Button>
    );
  };

  /**
   * Render (return HTML for icons) a mark-toggling toolbar button
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */
  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);
    return (
      <Button
        className={
          isActive ? "richtext_icon raisedbox active" : "richtext_icon"
        }
        onMouseDown={event => this.onClickMarkBtn(event, type)}
      >
        <Icon title={type}>{icon}</Icon>
      </Button>
    );
  };

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */
  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type === type);
  };

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */
  hasBlock = type => {
    const { value } = this.state;
    return value.blocks.some(node => node.type === type);
  };

  /**
   * When a mark button is clicked, toggle the current mark.
   * Callback for renderMarkButton
   *
   * @param {Event} event
   * @param {String} type
   */
  onClickMarkBtn = (event, type) => {
    event.preventDefault();
    this.editor.toggleMark(type);
  };

  /**
   * When a block button is clicked, toggle the block type.
   * Callback for renderBlockButton
   *
   * @param {Event} event
   * @param {String} type
   */
  onClickBlockBtn = (event, type) => {
    event.preventDefault();
    const { editor } = this;
    const { value } = editor;
    const { document } = value;
    const DEFAULT_NODE = "paragraph";
    // Handle everything but list buttons.
    if (type !== "bulleted-list" && type !== "numbered-list") {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock("list-item");
      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock("list-item");
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type);
      });
      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else if (isList) {
        editor
          .unwrapBlock(
            type === "bulleted-list" ? "numbered-list" : "bulleted-list"
          )
          .wrapBlock(type);
      } else {
        editor.setBlocks("list-item").wrapBlock(type);
      }
    }
  };
}

export default TextEditor;
