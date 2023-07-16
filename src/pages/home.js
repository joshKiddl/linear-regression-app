import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/navBar';
import homeImage from '../images/home-image.png';

function Home() {
  return (
    <div className="container">
      <NavBar />
      <h1 className='title'>Artificial Intelligence - Machine Learning Test Site</h1>
      <h2 className='blurb'>This site contains 3 of the most popular methods of Machine Learning. All methods here are based on one single dataset to show the difference between them. The intention is to learn how Machine Learning works and how to implement it.</h2>
      <img src={homeImage} alt="Home" style={{ width: '200px', height: 'auto' }} />
      <div className="buttons">
        <Link to="/linear-regression">
          <button className='btn'>Linear Regression</button>
        </Link>
        <Link to="/decision-trees">
          <button className='btn'>Decision Trees</button>
        </Link>
        <Link to="/logistic-regression">
          <button className='btn'>Logistic Regression</button>
        </Link>
        <Link to="/data-set">
          <button className='btn'>Data Set</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
