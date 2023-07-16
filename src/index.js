import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router>
    <AppRoutes />
  </Router>,
  rootElement
);
