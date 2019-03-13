import { Editor } from "slate-react";
import { Value } from "slate";

import React, { Component } from "react";
//import initialValue from "./value.json";
import Html from 'slate-html-serializer'
// Create a new serializer instance with our `rules` from above.
const html = new Html({ rules })

// Create our initial value...
const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'A line of text in a paragraph.',
              },
            ],
          },
        ],
      },
    ],
  },
})

const BLOCK_TAGS = {
  blockquote: 'quote',
  p: 'paragraph',
  pre: 'code',
}

// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underline',
}

const rules = [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()]
      if (type) {
        return {
          object: 'block',
          type: type,
          data: {
            className: el.getAttribute('class'),
          },
          nodes: next(el.childNodes),
        }
      }
    },
    serialize(obj, children) {
      if (obj.object == 'block') {
        switch (obj.type) {
          case 'code':
            return (
              <pre>
                <code>{children}</code>
              </pre>
            )
          case 'paragraph':
            return <p className={obj.data.get('className')}>{children}</p>
          case 'quote':
            return <blockquote>{children}</blockquote>
        }
      }
    },
  },
  // Add a new rule that handles marks...
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()]
      if (type) {
        return {
          object: 'mark',
          type: type,
          nodes: next(el.childNodes),
        }
      }
    },
    serialize(obj, children) {
      if (obj.object == 'mark') {
        switch (obj.type) {
          case 'bold':
            return <strong>{children}</strong>
          case 'italic':
            return <em>{children}</em>
          case 'underline':
            return <u>{children}</u>
        }
      }
    },
  },
]

/*function CodeNode(props) {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}*/

function MarkHotkey(options) {
  const { type, key } = options;
  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    onKeyDown(event, editor, next) {
      // If it doesn't match our `key`, let other plugins handle it.
      if (!event.ctrlKey || event.key != key) return next();

      // Prevent the default characters from being inserted.
      event.preventDefault();

      // Toggle the mark `type`.
      editor.toggleMark(type);
    }
  };
}

/*
// Create an array of plugins.
const plugins = [boldPlugin];

function BoldMark(props) {
  return <strong>{props.children}</strong>;
}

const boldPlugin = MarkHotkey({
  type: "bold",
  key: "b"
});
*/


// Initialize a plugin for each mark...
const plugins = [
  MarkHotkey({ key: "b", type: "bold" }),
  MarkHotkey({ key: "`", type: "code" }),
  MarkHotkey({ key: "i", type: "italic" }),
  MarkHotkey({ key: "~", type: "strikethrough" }),
  MarkHotkey({ key: "u", type: "underline" })
];






class TextEditor2 extends Component {
  state = {
    //value: initialValue
    value: html.deserialize(initialValue),
  };

  onChange = ({ value }) => {
    // When the document changes, save the serialized HTML to Local Storage.
    console.log('value.document',value.document, 'this.state.value.document',this.state.value.document)
    if (value.document != this.state.value.document) {
      const string = html.serialize(value)
      localStorage.setItem('content', string)
    }

    this.setState({ value })
  };

  onKeyDown = (event, editor, next) => {
    if (!event.ctrlKey) return next();

    switch (event.key) {
      case "b": {
        event.preventDefault();
        editor.toggleMark("bold");
        break;
      }
      case "`": {
        const isCode = editor.value.blocks.some(block => block.type == "code");
        event.preventDefault();
        editor.setBlocks(isCode ? "paragraph" : "code");
        break;
      }
      default: {
        return next();
      }
    }
  };

  render() {
    return (
      <Editor
        plugins={plugins}
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        // Add the ability to render our nodes and marks...
        renderNode={this.renderNode}
        renderMark={this.renderMark}
      />
    );
  }


  renderNode = (props, editor, next) => {
    switch (props.node.type) {
      case 'code':
        return (
          <pre {...props.attributes}>
            <code>{props.children}</code>
          </pre>
        )
      case 'paragraph':
        return (
          <p {...props.attributes} className={props.node.data.get('className')}>
            {props.children}
          </p>
        )
      case 'quote':
        return <blockquote {...props.attributes}>{props.children}</blockquote>
      default:
        return next()
    }
  }


    // Add a `renderMark` method to render marks.
    renderMark = (props, editor, next) => {
      const { mark, attributes } = props
      switch (mark.type) {
        case 'bold':
          return <strong {...attributes}>{props.children}</strong>
        case 'italic':
          return <em {...attributes}>{props.children}</em>
        case 'underline':
          return <u {...attributes}>{props.children}</u>
        default:
          return next()
      }
    }
}

export default TextEditor2;
