import React from 'react';
import { render } from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import { App } from './App';

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-family: monospace;
    font-size: 16px;
  }
  body {
    background-color: #121212;
    color: #fff;
    margin: 0rem;
    padding: 0rem;
  }
  *, *:before, *:after {
    box-sizing: 'inherit';
  }
`;

render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById('root')
);
