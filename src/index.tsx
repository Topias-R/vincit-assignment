import React from 'react';
import { render } from 'react-dom';
import { App } from './App';
import { Layout } from './components/Layout';

render(
  <Layout>
    <App />
  </Layout>,
  document.getElementById('root')
);
