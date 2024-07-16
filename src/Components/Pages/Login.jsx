// src/components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS Files/LoginSignup.css';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/Password.png';
import google_icon from '../Assets/google-logo.png';
import facebook_icon from '../Assets/facebook-logo.png';
import github_icon from '../Assets/github-logo.png';
import logo from '../Assets/Logo.png';
import { loginUser } from '../user-service';
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await loginUser({ email, password });
      console.log(userData);
      if (userData.token) {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('role', userData.role);
        
        toast.success("User is logged in!");
        navigate('/dashboard');
      } else {
        setError(userData.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError(error.message);
      toast.error("An error occurred while logging in");
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  return (
    <>
      <div className='Navbar'>
        <img src={logo} alt="" className='logo' />
      </div>
      <div className='main-container'>
        <div className='container'>
          <div className='header'>
            <div className='text'>Login</div>
            <div className='underline'></div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className='inputs'>
              <div className='input'>
                <img src={email_icon} alt="" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email Id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  invalid={error ? true : false}
                />
              </div>
              <div className='input'>
                <img src={password_icon} alt="" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  invalid={error ? true : false}
                />
              </div>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className='forgot-password'>Lost Password? <span>Click Here</span></div>
            <div className='submit-container'>
              <div className='submit'><Link to="/signup">Sign up</Link></div>
              <div className='submit gray'><button type="submit" className='submit gray'>Login</button></div>
            </div>
          </form>
        </div>
        <div className='auth-container'>
          <div className='auth-header'>Or Continue with</div>
          <div className='auth-buttons'>
            <div className='auth-button'>
              <img src={google_icon} alt="Google" />
              <span>Google</span>
            </div>
            <div className='auth-button'>
              <img src={facebook_icon} alt="Facebook" />
              <span>Facebook</span>
            </div>
            <div className='auth-button'>
              <img src={github_icon} alt="GitHub" />
              <span>GitHub</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;