import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    geometry: {
      borderRadius: string;
    };
    colors: {
      text: {
        light: string;
        dark: string;
      };
      background: {
        main: string;
      };
      primary: {
        main: string;
        light: string;
      };
      secondary: {
        main: string;
        light: string;
      };
      error: string;
    };
  }
}
