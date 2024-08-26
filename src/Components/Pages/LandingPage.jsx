import React from 'react';
import '../CSS Files/Landingpage.css';
import logo from '../Assets/Logo.png';
import { GoArrowRight } from "react-icons/go";
import { BiTask } from "react-icons/bi";
import { AiOutlineClockCircle } from "react-icons/ai";
import { LuBrain } from "react-icons/lu";
import feature_1 from '../Assets/feature-1.png';
import feature_2 from '../Assets/feature-2.png';
import feature_3 from '../Assets/feature-3.png';
import feature_4 from '../Assets/feature-4.png';
const LandingPage = () => {
  return (

    <div>

      {/* Navbar */}
      <nav className="navbar7">
        <div className="navbar-container">

          <div className="navbar-logo">
          <a href="/Landingpage" className="navbar-logo">
            <img src={logo} alt="TaskLumina Logo" className="logo-img" />
          </a>
          </div>

          <div className="navbar-menu">
            <a href="/login" className="login-button">Sign in</a>
            <a href="/signup" className="Signup-button">Sign up</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Your Personal Assistant for a Productive Day</h1>
          <p className="hero-subtitle">Organize your day, manage your workload, and stay focused.</p>
          <div className="button-container">
            <a href="/signup" className="primary-button">
              Get Started <GoArrowRight className="button-icon" />
            </a>
          </div>
        </div>
      </section>

      {/* Features Overview Section */}
      <section id="features" className="features-section">

        <div className="features-grid">
          <div className="feature-item">
            <BiTask className="feature-icon" />

            <h3>Simple Task Management</h3>
            <p>Effortlessly create, update, and organize your tasks with an intuitive interface designed for productivity.</p>

          </div>
          <div className="feature-item">
            <AiOutlineClockCircle className="feature-icon" />
            <h3>Seamless Scheduling</h3>
            <p>Customize your routine to fit your priorities and ensure you never miss a deadline.</p>
          </div>
          <div className="feature-item">
            <LuBrain className="feature-icon" />
            <h3>AI-Powered Assistance</h3>
            <p>Get smart recommendations and instant support with our AI-driven chatbot.</p>
          </div>
        </div>
      </section>
      <section id="features" className="feature-details">
        <h2 className="feature-details-title">Explore Our Features</h2>
        <div className="feature-details-grid">
          <div className="feature-detail-item">
            <img src={feature_1} alt="feature_1" />
            <h3>Simple Task Management</h3>
            <p>Effortlessly create, update, and organize your tasks with an intuitive interface designed for productivity.</p>
          </div>
          <div className="feature-detail-item-2">
            <img src={feature_2} alt="feature_2" />
            <h3>Seamless Scheduling</h3>
            <p>Customize your routine to fit your priorities and ensure you never miss a deadline.</p>
          </div>
          <div className="feature-detail-item-2">
            <img src={feature_3} alt="feature_3" />
            <h3>AI-Powered Assistance</h3>
            <p>Get smart recommendations and instant support with our AI-driven chatbot.</p>
          </div>
          <div className="feature-detail-item">
            <img src={feature_4} alt="feature_4" />
            <h3>Achievements & Rewards</h3>
            <p>Earn badges, accumulate points, and participate in challenges to stay motivated and track your progress.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;