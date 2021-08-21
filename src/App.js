/* eslint-disable no-undef */
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase_config';
import { useState } from 'react';


// firebase initialization
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // if already initialized, use that one
}

function App() {
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    success: false,
    error:'',
  });

  // handle Change
  const handleChange = (event) => {
    // console.log(event.target.name, event.target.value);
    let isFieldValid = true;
    if (event.target.name == 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);

    }
    if (event.target.name == 'password') {
      const isPasswordValid = event.target.value.length > 8;
      const isPasswordHasNumber = /\d{1}/.test(event.target.value);
      isFieldValid = (isPasswordValid && isPasswordHasNumber);

    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);

    }

  }


  // Form submit 
  const handleSubmit = (event) => {
    // console.log(user.email,user.password);
    if (user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          console.log(res);
          const newUserInfo = {...user};
          newUserInfo.success = true;
          newUserInfo.error = '';
          setUser(newUserInfo);
        })
        .catch((error) => {
          // const errorCode = error.code;
          // const errorMessage = error.message;
          // console.log(errorMessage);
          const newUserInfo = { ...user };
          newUserInfo.success = false;
          newUserInfo.error = error.message;
          setUser(newUserInfo);
        });
    }

    event.preventDefault();
  };

  return (
    <div className="App">
      <h1 className="my-5">Our own Authentication</h1>
      {/* <h3>Name: {user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p> */}
      <form onSubmit={handleSubmit} >
        <input onBlur={handleChange} className="form-control text-field" type="text" name="name" id="" placeholder="Name" required />
        <br />
        <input onBlur={handleChange} className="form-control text-field" type="email" name="email" placeholder="Your Email" required />
        <br />
        <input onBlur={handleChange} className="form-control text-field" type="password" name="password" placeholder="Password" required />
        <br />
        <input type="submit" value="Submit" className="btn btn-primary"/>
      </form>
      {/* Error Message */}
      <p style={{color: 'red',textAlign: 'center',marginTop: '50px'}}>{user.error}</p>
      {
        user.success && <p style={{color:'green',textAlign: 'center'}}>User created successfully</p>
      }
    </div>
  );
}

export default App;
