import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Problem from './pages/problem';
import AcceptanceCriteria from './pages/acceptanceCriteria';
import TechnicalRequirements from './pages/technicalRequirements';
import Tasks from './pages/tasks';
import TargetCustomer from './pages/targetCustomer';
import MarketSize from './pages/marketSize';
import DataElements from './pages/dataElements';
import Hypothesis from './pages/hypothesis';
import MarketingMaterial from './pages/marketingMaterial';
import Summary from './pages/summary';
import SignUp from './pages/signUp';
import ListOfFeatures from './pages/listOfFeatures';
import Login from './pages/login';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/problem" element={<Problem />} />
      <Route path="/acceptanceCriteria" element={<AcceptanceCriteria />} />
      <Route path="/technicalRequirements" element={<TechnicalRequirements />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/targetCustomer" element={<TargetCustomer />} />
      <Route path="/marketSize" element={<MarketSize />} />      
      <Route path="/dataElements" element={<DataElements />} />      
      <Route path='/marketingMaterial' element={<MarketingMaterial />} />
      <Route path="/hypothesis" element={<Hypothesis />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/listOfFeatures" element={<ListOfFeatures />} />
    </Routes>
  );
};

export default AppRoutes;
