import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import DecisionTrees from './pages/decisionTrees';
import LogicalRegression from './pages/logicalRegression';
import DataSet from './pages/dataSet';
import NLP from './pages/NLP';
import Problem from './pages/problem';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/problem" element={<Problem />} />
      <Route path="/decisionTrees" element={<DecisionTrees />} />
      <Route path="/logicalRegression" element={<LogicalRegression />} />
      <Route path="/dataSet" element={<DataSet />} />
      <Route path="/NLP" element={<NLP />} />
    </Routes>
  );
};

export default AppRoutes;
