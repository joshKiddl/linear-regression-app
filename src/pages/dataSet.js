import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../components/navBar';

function DataSet() {
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://ml-linear-regression.onrender.com/data', {
        responseType: 'blob',
      });

      // Create a URL object from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create an anchor element to trigger the file download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Data.csv');
      document.body.appendChild(link);
      link.click();

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <NavBar />
      <h1>Data Set</h1>
      {loading ? (
        <p className='blurb'>Data.csv file is being downloaded...</p>
      ) : (
        <button className='btn' onClick={fetchData}>Download the Dataset</button>
      )}
    </div>
  );
}

export default DataSet;
