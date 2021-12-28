import React from 'react';
import { render } from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import { App } from './App';
import { Rocket } from './components/Rocket';
import { ViewPortContainer } from './components/ViewPortContainer';

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-family: monospace;
    font-size: 16px;
  }

  #root {
    overflow: hidden;
    position: relative;
  }

  @media	only screen and (-webkit-min-device-pixel-ratio: 1.3),
	only screen and (-o-min-device-pixel-ratio: 13/10),
	only screen and (min-resolution: 120dpi) {
		html {
      font-size: 28px;
    }
	}

  body {
    background-color: #121212;
    color: #fff;
    margin: 0rem;
    padding: 0rem;
    overflow: hidden;
  }
  *, *:before, *:after {
    box-sizing: 'inherit';
  }
`;

const Rockets = Array.from({ length: 100 }, () => <Rocket></Rocket>);

render(
  <>
    <GlobalStyle />
    <ViewPortContainer>
      <App />
    </ViewPortContainer>
    {Rockets}
  </>,
  document.getElementById('root')
);
