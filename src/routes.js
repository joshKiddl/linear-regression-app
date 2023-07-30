import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { auth } from './firebase'; // Ensure to import from your firebase config file
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
import CreateFeature from './pages/createFeature';
import EditFeature from './pages/editFeature';
import Board from './pages/board';

const AppRoutes = () => {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        sessionStorage.setItem('uid', user.uid);
        console.log('User is logged in:', user.uid);
      } else {
        sessionStorage.removeItem('uid');
        console.log('User is logged out');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
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
      <Route path="/createFeature" element={<CreateFeature />} />
      <Route path="/editFeature" element={<EditFeature />} />
      <Route path="/board" element={<Board />} />
    </Routes>
  );
};

export default AppRoutes;
