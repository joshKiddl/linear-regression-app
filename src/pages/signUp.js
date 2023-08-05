import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, EmailAuthProvider, linkWithCredential } from "firebase/auth"; // import GoogleAuthProvider, signInWithPopup, EmailAuthProvider and linkWithCredential
import '../styling/signUpAndIn.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // import serverTimestamp
import { db } from "../firebase"; // Import your Firestore instance (update the path if needed)

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
    
    if (auth.currentUser) {
      const credential = EmailAuthProvider.credential(email, password);

      linkWithCredential(auth.currentUser, credential)
        .then((userCredential) => {
          console.log('Anonymous account successfully upgraded:', userCredential.user);
          const userId = userCredential.user.uid;
          // Update the user's document with the email and signUpDate fields
          const userDocRef = doc(db, "users", userId);
          setDoc(userDocRef, {
            email: email,
            signUpDate: serverTimestamp()
          }, { merge: true });
          sessionStorage.setItem('userId', userId);
          navigate('/listOfFeatures');
        })
        .catch((error) => {
          if (error.code === 'auth/provider-already-linked') {
            setErrorMsg('This Google account is already linked with another user. Please try with a different account.');
          } else {
            console.error('Error upgrading anonymous account:', error);
            setErrorMsg('Failed to upgrade the anonymous account.');
          }
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User:', user);
        const userId = user.uid;
        // Create the user's document with the email and signUpDate fields
        const userDocRef = doc(db, "users", userId);
        setDoc(userDocRef, {
          email: email,
          signUpDate: serverTimestamp()
        });
        sessionStorage.setItem('userId', userId);
        navigate('/listOfFeatures'); 
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error:', errorCode, errorMessage);
        setErrorMsg('Account already exists with this email address.');
      });
    }
  }

  const handleGoogleSignUp = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
  
    if (auth.currentUser) {
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
  
          linkWithCredential(auth.currentUser, credential)
            .then(async (userCredential) => {
              console.log('Anonymous account successfully upgraded:', userCredential.user);
              const user = userCredential.user;
              sessionStorage.setItem('userId', user.uid);
  
              // Update the Firestore document with email and signUpDate fields
              const userRef = doc(db, "users", user.uid);
              await setDoc(userRef, {
                email: user.email,
                signUpDate: serverTimestamp()
              }, { merge: true });
  
              navigate('/listOfFeatures');
            })
            .catch((error) => {
              console.error('Error upgrading anonymous account:', error);
            });
        })
        .catch((error) => {
          console.error('Error signing in with Google:', error);
        });
    } else {
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          console.log('User:', user);
          sessionStorage.setItem('userId', user.uid);
  
          // Create the Firestore document with email and signUpDate fields
          const userRef = doc(db, "users", user.uid);
          setDoc(userRef, {
            email: user.email,
            signUpDate: serverTimestamp()
          })
            .then(() => {
              console.log("Document successfully written!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
  
          navigate('/listOfFeatures');
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };
  

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
