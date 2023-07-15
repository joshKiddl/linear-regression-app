import React from 'react';
import { createRoot } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <Router>
    <AppRoutes />
  </Router>
);
