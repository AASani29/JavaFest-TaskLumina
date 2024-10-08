import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS Files/Signup.css";
import google_icon from "../Assets/google-logo.png";
import { signUp } from "../Common/user-service";
import { toast } from "react-toastify";
import signup from "../Assets/signup.png";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
  });

  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetData = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      city: "",
    });
    setError({ errors: {}, isError: false });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      // Add role: "USER" to formData before signing up
      const formDataWithRole = { ...formData, role: "USER" };
      await signUp(formDataWithRole);
      toast.success("User is registered!");
      navigate("/login");
      resetData();
    } catch (error) {
      setError({
        errors: error,
        isError: true,
      });
      console.error("Error registering user:", error);
      toast.error("An error occurred while registering user");
    }
  };

  return (
    <>
      <div className="main-container">
        <div className="container">
          <div className="header">
            <div className="text">
              <h1>Sign up</h1>
            </div>
          </div>

          <form onSubmit={handleSubmitForm}>
            <div className="inputs">
              <label htmlFor="name">
                <div className="label_text ">Name</div>
              </label>
              <div className="input">
                {/* <img src={user_icon} alt=""/> */}
                <input
                  onChange={handleInputChange}
                  id="name"
                  name="name"
                  placeholder="name"
                  type="text"
                  value={formData.name}
                  invalid={error.errors?.response?.data?.name ? true : false}
                />
              </div>
              <label htmlFor="email">
                <div className="label_text ">Email</div>
              </label>
              <div className="input">
                {/* <img src={email_icon} alt=""/> */}
                <input
                  onChange={handleInputChange}
                  id="email"
                  name="email"
                  placeholder="name@gmail.com"
                  type="email"
                  value={formData.email}
                  invalid={error.errors?.response?.data?.email ? true : false}
                />
              </div>
              <label htmlFor="password">
                <div className="label_text ">Password</div>
              </label>
              <div className="input">
                <input
                  onChange={handleInputChange}
                  id="password"
                  name="password"
                  placeholder="password"
                  type="password"
                  value={formData.password}
                  invalid={
                    error.errors?.response?.data?.password ? true : false
                  }
                />
              </div>
            </div>
            <div className="submit-container">
              <div className="submit gray">
                <button type="submit" className="submit gray">
                  Sign up
                </button>
              </div>
            </div>
          </form>

          <div className="auth-container">
            <div className="auth-header">Or</div>
            <div className="auth-buttons">
              <div className="auth-button">
                <img src={google_icon} alt="Google" />
                <span>Continue with Google</span>
              </div>
            </div>
          </div>
          <div className="submit-container">
            <p className="login-text">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Login
              </Link>
            </p>
          </div>
        </div>
        <div className="side-container">
          <div className="side_text">
            <h1>Plan, manage, and streamline your tasks with ease!</h1>
          </div>
          <img src={signup} alt="Centered Image" class="centered-image" />
        </div>
      </div>
      */
    </>
  );
};

export default SignUp;
