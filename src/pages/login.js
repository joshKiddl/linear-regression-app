import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; // import necessary functions for Google login
import { auth } from '../firebase'; 
import { useNavigate, Link } from 'react-router-dom';
import '../styling/signUpAndIn.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
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
      setErrorMsg('Email or password incorrect.');
    });
  }

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
    .then(() => {
      setResetMsg('Password reset email sent.');
    })
    .catch((error) => {
      console.error('Error in password reset:', error);
      setErrorMsg('Error in password reset. Please try again.');
    });
  }

  const handleGoogleLogin = () => { // new function for Google login
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
      <h2 className='login-h2'>Log In</h2>
      <form className='form' onSubmit={handleSubmit}>
        <label>
          Email:
          <input 
            type="email" 
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
        </label>
        <label>
          Password:
          <input 
            type="password" 
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <input className='btn' type="submit" value="Log In" />
      </form>
      <button onClick={handlePasswordReset} className="reset-password-btn">Forgot password?</button>
      <button onClick={handleGoogleLogin} className='google-btn'>Log In with Google</button>
      <Link className='to-other-auth' to="/signUp">Don't have an account?</Link>
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
      {resetMsg && <p className="reset-msg">{resetMsg}</p>}
    </div>
  );
}

export default Login;
