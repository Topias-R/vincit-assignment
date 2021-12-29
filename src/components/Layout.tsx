import React, { ReactNode } from 'react';
import {
  createGlobalStyle,
  DefaultTheme,
  ThemeProvider
} from 'styled-components';
import { Rocket } from './Rocket';
import { ViewPortContainer } from './ViewPortContainer';

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
    box-sizing: inherit;
  }
`;

const Rockets = Array.from({ length: 100 }, () => <Rocket></Rocket>);

const theme: DefaultTheme = {
  geometry: {
    borderRadius: '0.25rem'
  },
  colors: {
    background: {
      main: '#1e1e1e'
    },
    text: {
      light: '#ffffff',
      dark: '#000000'
    },
    primary: {
      main: '#3700B3',
      light: '#d4bff9'
    },
    secondary: {
      main: '#6200EE',
      light: '#efe5fd'
    },
    error: '#b00020'
  }
};

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ViewPortContainer>{children}</ViewPortContainer>
      {...Rockets}
    </ThemeProvider>
  );
}
