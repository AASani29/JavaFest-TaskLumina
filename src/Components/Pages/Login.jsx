import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS Files/Login.css";
import google_icon from "../Assets/google-logo.png";
import logo from "../Assets/images/TaskLuminaLogo.png";
import { loginUser } from "../Common/user-service";
import { toast } from "react-toastify";
import leftImage from "../Assets/left-image.png";
import rightImage from "../Assets/right-image.png";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await loginUser({ email, password });
      console.log(userData);
      if (userData.token) {
        // Store token in localStorage
        localStorage.setItem("token", userData.token);
        // Store complete user data in localStorage
        localStorage.setItem("userData", JSON.stringify(userData));

        toast.success("User is logged in!");
        navigate("/dashboard");
      } else {
        setError(userData.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError(error.message);
      toast.error("An error occurred while logging in");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <>
      <div className="navbar2">
        <img src={logo} alt="TaskLumina Logo" className="logo" />
      </div>

      <div className="main-container2">
        <div className="left-image">
          <img src={leftImage} alt="Left Side Image" />
        </div>

        <div className="container2">
          <div className="header2">
            <div className="text2">
              <h1>Welcome Back!</h1>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="inputs">
              <label htmlFor="email">
                <div className="label_text2 ">Email</div>
              </label>
              <div className="input">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  invalid={error ? true : false}
                />
              </div>
              <label htmlFor="password">
                <div className="label_text2 ">Password</div>
              </label>
              <div className="input">
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
            <div className="forgot-password">
              Lost Password? <span>Click Here</span>
            </div>

            <div className="submit-container">
              <div className="submit gray">
                <button type="submit" className="submit gray">
                  Login
                </button>
              </div>
            </div>

            <div className="auth-container">
              <div className="auth-header">Or</div>
              <div className="auth-buttons">
                <div className="auth-button">
                  <img src={google_icon} alt="Google" />
                  <span>Continue with Google</span>
                </div>
                {/* Other auth buttons */}
              </div>
            </div>

            <div className="submit-container">
              <p className="login-text">
                Not a member?{" "}
                <Link to="/signup" className="login-link">
                  Sign up now
                </Link>
              </p>
            </div>
          </form>
          <div className="right-image">
            <img src={rightImage} alt="Right Side Image" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
