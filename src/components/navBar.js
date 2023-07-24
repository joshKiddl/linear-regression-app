import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';


const NavBar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">Linear Regression</Link>
        </li>
        <li className="navbar-item">
        <Link to="/decisionTrees" className="navbar-link">Decision Trees</Link>
        </li>
        <li className="navbar-item">
          <Link to="/logicalRegression" className="navbar-link">Logical Regression</Link>
        </li>
        <li className="navbar-item">
          <Link to="/NLP" className="navbar-link">NLP</Link>
        </li>
        <li className="navbar-item">
          <Link to="/dataSet" className="navbar-link">The Data Set</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
