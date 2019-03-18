import React from "react";
import styled from "@emotion/styled";
import styled2 from 'styled-components'

//export const Button = "span";
export const Button = styled2.span`
  cursor: pointer;
  color: black;
  `
  /*
  background-color: ${props => {
    console.log('props.reversed, .active:', props.reversed, props.active)
    return props.reversed
      ? props.active
        ? "white"
        : "#aaa"
      : props.active
      ? "black"
      : "rgba(50, 50, 50, 0.25)";
  }};
`;
*/
/*
export const Icon2 = styled(({ className, ...rest }) => {
  return <span className={`material-icons ${className}`} {...rest} />;
})`
  font-size: 18px;
  vertical-align: text-bottom;
`;*/
export const Icon = ({ className, ...rest }) => (
  <span className={`material-icons ${className}`} {...rest} />
);


export const Menu = styled2.div`
  & > * {
    display: inline-block;
  }
  & > * + * {
    margin-left: 15px;
  }
`;

export const Toolbar = styled2(Menu)`
  position: relative;
  padding: 1px 18px 17px;
  /*margin: 0 -20px;*/
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
`;
