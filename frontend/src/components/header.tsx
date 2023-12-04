import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/header.css";
import {useNavigate} from "react-router-dom";
import {Box, Link, Typography} from '@mui/material';
import NavItem from "./navItem";

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
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',

                }}>
                    <NavItem url={'/homepage'} text={'Dashboard'}/>
                    <NavItem url={'/tokens'} text={'Tokens'}/>

                    <button onClick={handleLogout} className="btn btn-primary">
                        Logout
                    </button>
                </Box>
            );
        } else {
            // User is not authenticated, render login and register buttons
            return (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',

                }}>
                    <NavItem url={'/login'} text={'Login'}/>
                    <NavItem url={'register'} text={'Register'}/>
                </Box>
            );
        }
    };

    return (
        <div className="header">
            <div className="header-content">
                <div className="header-name">FLOWer</div>

                <div className="header-buttons">
                    {renderButtons()}
                </div>
            </div>
        </div>
    );
}

export default Header;
