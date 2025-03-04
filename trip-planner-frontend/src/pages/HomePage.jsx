import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleGetStarted = () => {
        login();
    };

    const handleViewTrips = () => {
        navigate('/trips');
    };

    const LoggedOutView = () => (
        <>
            <h1 className="app-title">Trip Planner</h1>
            <p className="tagline">Plan your next adventure with ease</p>
            <div className="features-grid">
                <div className="feature-card">
                    <span className="feature-icon">✈️</span>
                    <h3>Plan Trips</h3>
                    <p>Organize your itineraries effortlessly</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">📍</span>
                    <h3>Save Places</h3>
                    <p>Keep track of must-visit destinations</p>
                </div>
            </div>
            <button className="cta-button" onClick={handleGetStarted}>
                Get Started
            </button>
        </>
    );

    const LoggedInView = () => (
        <>
            <h1 className="app-title">Welcome Back!</h1>
            <p className="tagline">Ready to plan your next adventure?</p>
            <button className="cta-button" onClick={handleViewTrips}>
                View My Trips
            </button>
        </>
    );

    return (
        <div className="home-container">
            <div className="hero-section">
                {user ? <LoggedInView /> : <LoggedOutView />}
            </div>
        </div>
    );
};

export default HomePage;