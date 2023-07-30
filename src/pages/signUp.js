import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // import GoogleAuthProvider and signInWithPopup
import '../styling/signUpAndIn.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(''); 
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
    
    const auth = getAuth();
    
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User:', user);
      sessionStorage.setItem('userId', user.uid);
      navigate('/listOfFeatures'); 
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error:', errorCode, errorMessage);
      setErrorMsg('Account already exists with this email address.');
    });
  }

  const handleGoogleSignUp = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log('User:', user);
      sessionStorage.setItem('userId', user.uid);
      navigate('/listOfFeatures');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  return (
    <div className="sign-in">
      <h2 className='login-h2'>Sign Up</h2>
      <form className='form' onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" onChange={handleInputChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" onChange={handleInputChange} />
        </label>
        <input type="submit" className='btn' value="Sign Up with Email" />
      </form>
      <button onClick={handleGoogleSignUp} className='google-btn'>Sign Up with Google</button>
      <Link className='to-other-auth' to="/login">or log in</Link>
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
    </div>
  );
}

export default SignUp;
