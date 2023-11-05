import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/header.css";
import { Link, useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the authToken from localStorage
        localStorage.removeItem('authToken');
        navigate("/login");
    };

    const renderButtons = () => {
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
            // User is authenticated, render a logout button
            return (
                <button onClick={handleLogout} className="btn btn-primary">
                    Logout
                </button>
            );
        } else {
            // User is not authenticated, render login and register buttons
            return (
                <div>
                    <Link to="/login">
                        <button type="submit" className="btn btn-primary">
                            Login
                        </button>
                    </Link>
                    <Link to="/register">
                        <button type="submit" className="btn btn-primary">
                            Register
                        </button>
                    </Link>
                </div>
            );
        }
    };

    return (
        <div className="header">
            <div className="header-content">
                <div className="header-name">ASOS_PROJECT</div>
                <div className="header-buttons">
                    {renderButtons()}
                </div>
            </div>
        </div>
    );
}

export default Header;
