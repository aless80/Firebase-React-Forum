import { Editor } from "slate-react";
import { Value } from "slate";
import React from "react";
import { isKeyHotkey } from "is-hotkey";
import {
  TextArea,
  EditorContainer,
  Button,
  Icon,
  Toolbar
} from "./StyledComponents";
import './TextEditor.css';
import Plain from "slate-plain-serializer";
import Html from "slate-html-serializer";
//https://github.com/wesharehoodies/slate-react-rich-text-editor/tree/part-1
//github slate https://github.com/ianstormtaylor/slate
//docs slate https://docs.slatejs.org/
//example links https://github.com/ianstormtaylor/slate/tree/master/examples/links

/**
 * Deserialize == convert DOM to Slate model
 * Serialize == convert Slate model to DOM
 *
 * @type {Object}
 */
const rules = [
  {
    deserialize(el, next) {
      const BLOCK_TAGS = {
        blockquote: "blockquote",
        p: "paragraph",
        pre: "code",
        h1: "heading-one",
        h2: "heading-two",
        ol: "numbered-list",
        ul: "bulleted-list",
        li: "list-item",
        a: "link"
      };
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];
      //console.log('deserialize block. type:', type, el.tagName.toLowerCase())
      if (type) {
        if (type === "link") {
          var obj = {
            object: "inline",
            type: type,
            data: { href: el.getAttribute("href") },
            nodes: next(el.childNodes)
          };
          return obj;
        } else {
          return {
            object: "block",
            type: type,
            data: { className: el.getAttribute("class") },
            nodes: next(el.childNodes)
          };
        }
      }
    },
    serialize(obj, children) {
      //console.log("serialize block/inline. obj.object:", obj.object, obj.toJSON());
      if (obj.object === "inline") {
        if (obj.type === "link") {
          //console.log("  serialize inline obj.toJSON():", obj.toJSON());
          //this is what gets stored in firebase
          return <a href={obj.toJSON().data.href}>{children}</a>;
        }
      }
      if (obj.object === "block") {
        //console.log("  serialize block. obj.type:", obj.type, obj.toJSON());
        switch (obj.type) {
          case "code":
            return (
              <pre>
                <code>{children}</code>
              </pre>
            );
          case "paragraph":
            return <p className={obj.data.get("className")}>{children}</p>;
          case "blockquote":
            return <blockquote>{children}</blockquote>;
          case "heading-one":
            return <h1>{children}</h1>;
          case "heading-two":
            return <h2>{children}</h2>;
          case "numbered-list":
            return <ol>{children}</ol>;
          case "bulleted-list":
            return <ul>{children}</ul>;
          case "list-item":
            return <li>{children}</li>;
          default:
            console.error(
              "serialize block on default case. obj.type=",
              obj.type
            );
        }
      }
    }
  },
  {
    deserialize(el, next) {
      const MARK_TAGS = {
        em: "italic",
        strong: "bold",
        u: "underlined"
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
    serialize(obj, children) {
      if (obj.object === "mark") {
        switch (obj.type) {
          case "bold":
            return <strong>{children}</strong>;
          case "italic":
            return <em>{children}</em>;
          case "underlined":
            return <u>{children}</u>;
          default:
            console.error(
              "serialize mark on default case. obj.type=",
              obj.type
            );
        }
      }
    }
  }
];

/**
 * Create a new serializer instance with our 'rules'
 *  @type {Html}
 */
const html = new Html({ rules });

/**
 * A change helper to standardize wrapping links.
 *
 * @param {Editor} editor
 * @param {String} href
 */
function wrapLink(editor, href) {
  editor.wrapInline({
    type: "link",
    data: { href }
  });

  editor.moveToEnd();
}

/**
 * A change helper to standardize unwrapping links.
 *
 * @param {Editor} editor
 */
function unwrapLink(editor) {
  editor.unwrapInline("link");
}

class TextEditor extends React.Component {
  /**
   * Store a reference to the `editor`.
   *
   * @param {Editor} editor
   */
  ref = editor => {
    this.editor = editor;
  };

  /**
   * State: serialize the initial editor value.
   * @type {Object}
   */
  state = {
    value: Value.fromJSON(html.deserialize("")),
    plainText: "",
    valueHtml: ""
  };

  /**
   * Set state from props
   * @param {*} nextProps
   */
  componentWillReceiveProps(nextProps) {
    //console.log('\ncomponentWillReceiveProps')
    const value = Value.fromJSON(html.deserialize(nextProps.initialRichText));
    const plainText = Plain.serialize(value);
    //console.log('  plainText:', plainText)
    const valueHtml = nextProps.initialRichText;
    //console.log('  valueHtml:', valueHtml)
    this.setState({ value, plainText, valueHtml });
  }

  /**
   * Check whether the current selection has a link in it.
   *
   * @return {Boolean} hasLinks
   */
  hasLinks = () => {
    const { value } = this.state;
    return value.inlines.some(inline => inline.type === "link");
  };

  /**
   * Render the app.
   *
   * @return {Element} element
   */
  render() {
    const textareaHeight = {
      height: "8em"
    };
    return (
      <div className="textEditor">
        <EditorContainer>
          <Toolbar>
            {this.renderMarkButton("bold", "format_bold")}
            {this.renderMarkButton("italic", "format_italic")}
            {this.renderMarkButton("underlined", "format_underlined")}
            {this.renderBlockButton("code", "code")}
            {this.renderBlockButton("heading-one", "looks_one")}
            {this.renderBlockButton("heading-two", "looks_two")}
            {this.renderBlockButton("blockquote", "format_quote")}
            {this.renderBlockButton("numbered-list", "format_list_numbered")}
            {this.renderBlockButton("bulleted-list", "format_list_bulleted")}
            <Button
              active={this.hasLinks()}
              onMouseDown={event => this.onClickLink(event, "looks_two")}
            >
              <Icon title="insert_link">insert_link</Icon>
            </Button>
          </Toolbar>
          <TextArea>
            <Editor
              spellCheck
              autoFocus
              placeholder=""
              style={textareaHeight}
              ref={this.ref}
              value={this.state.value}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              renderMark={this.renderMark}
              renderNode={this.renderBlock}
            />
          </TextArea>
        </EditorContainer>
        <div className="resizable grippie bbr-sm mr-0" />
      </div>
    );
  }

  /**
   * On change, save the new `value`.
   *
   * @param {Editor} editor
   */
  onChange = ({ value }) => {
    //console.log('onChange')
    //if (value.document != this.state.value.document) {
    const plainText = Plain.serialize(value);
    //console.log('  plainText:', plainText)
    // Show HTML of serialized Slate json
    //var valueHtml = html.serialize(value); //this.state.
    //console.log('valueHtml:', valueHtml)
    // Print Slate json or html string
    //console.log('JSON.stringify(value.toJSON()): ',JSON.stringify(value.toJSON(), null, 4))
    //console.log("valueHtml:", valueHtml);
    // Set state
    var valueHtml = html.serialize(Value.fromJSON(value));
    //console.log("valueHtml:", valueHtml);
    //console.log("  valueHtml:", valueHtml);
    this.setState({ value, plainText, valueHtml });
  };

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
    if (isBoldHotkey(event)) {
      mark = "bold";
    } else if (isItalicHotkey(event)) {
      mark = "italic";
    } else if (isUnderlinedHotkey(event)) {
      mark = "underlined";
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
   * @param {Editor} editor
   * @param {Function} next
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
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */
  renderBlock = (props, editor, next) => {
    const { attributes, children, node } = props;
    switch (node.type) {
      case "code":
        return <code {...attributes}>{children}</code>;
      case "blockquote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "heading-one":
        return <h1 {...attributes}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes}>{children}</h2>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "link":
        const { data } = node;
        const href = data.get("href");
        return (
          <a {...attributes} href={href}>
            {children}
          </a>
        );
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
      <Button
        isActive={isActive}
        onMouseDown={event => this.onClickBlockBtn(event, type)}
      >
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
        isActive={isActive}
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
   * When clicking a link, if the selection has a link in it, remove the link.
   * Otherwise, add a new link with an href and text.
   *
   * @param {Event} event
   * @param {String} type
   */
  onClickLink = (event, type) => {
    event.preventDefault();
    const { editor } = this;
    const { value } = editor;
    //const { document } = value;
    const hasLinks = this.hasLinks();
    if (hasLinks) {
      editor.command(unwrapLink);
    } else if (value.selection.isExpanded) {
      const href = window.prompt("Enter the URL of the link:");
      if (href == null) {
        return;
      }
      editor.command(wrapLink, href);
    } else {
      const href = window.prompt("Enter the URL of the link:");
      if (href == null) {
        return;
      }
      const text = window.prompt("Enter the text for the link:", "My link");
      if (text == null) {
        return;
      }
      editor
        .insertText(text)
        .moveFocusBackward(text.length)
        .command(wrapLink, href);
    }
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
