import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import DecisionTrees from './pages/decisionTrees';
import LogicalRegression from './pages/logicalRegression';
import DataSet from './pages/dataSet';
import Home from './pages/home'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/decisionTrees" element={<DecisionTrees />} />
      <Route path="/logicalRegression" element={<LogicalRegression />} />
      <Route path="/dataSet" element={<DataSet />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
