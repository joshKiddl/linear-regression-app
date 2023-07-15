import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import DecisionTrees from './pages/decisionTrees';
import LogicalRegression from './pages/logicalRegression';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/decisionTrees" element={<DecisionTrees />} />
      <Route path="/logicalRegression" element={<LogicalRegression />} />
    </Routes>
  );
};

export default AppRoutes;
