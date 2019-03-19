import React from "react";
import styled, { css } from "styled-components";

export const EditorContainer = styled.div`
  background-color: #f6f4d0;
  padding: 0;
`;

export const TextArea = styled.div`
  resize: vertical;
  overflow: auto;
`;

export const Button = styled.span`
  cursor: pointer;
  color: black;
  cursor: pointer;
  color: black;
  ${props =>
    !props.isActive &&
    css`
      padding: 1px;
      border: 1px transparent rgba(255, 255, 255, 0.5);
    `};
  ${props =>
    props.isActive &&
    css`
      padding: 0px;
      border: 1px dotted rgb(122, 121, 121);
      box-shadow: -1px 1px #ccc, -2px 2px #ccc, -3px 3px #ccc, -4px 4px #ccc;
    `};
`;

export const Icon = ({ className, ...rest }) => (
  <span className={`material-icons ${className}`} {...rest} />
);

export const Menu = styled.div`
  & > * {
    display: inline-block;
  }
  & > * + * {
    margin-left: 15px;
  }
`;

export const Toolbar = styled(Menu)`
  position: relative;
  padding: 1px 18px 17px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
`;

/*export const StyledBlockquote = styled(Menu)`
  display: block;
  margin-top: 1em;
  margin-bottom: 1em;
  margin-left: 40px;
  margin-right: 40px;

  font-family: Georgia, serif;
  font-style: italic;
  width: 500px;
  line-height: 1.45;
  position: relative;
  color: #383838;

  background: lightgray;
  border-left: 10px solid #ccc;
  margin: 1.5em 10px;
  padding: 0.5em 10px;
`;
*/
