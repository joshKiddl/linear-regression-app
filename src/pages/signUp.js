import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import '../styling/signUpAndIn.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../firebase'; 
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    if (event.target.name === 'email') {
      setEmail(event.target.value);
    } else if (event.target.name === 'password') {
      setPassword(event.target.value);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('User:', user);
        navigate('/listOfFeatures'); // navigate to ListOfFeatures after signup
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error:', errorCode, errorMessage);
      });
  }

  return (
    <div className="sign-up">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" onChange={handleInputChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" onChange={handleInputChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default SignUp;
