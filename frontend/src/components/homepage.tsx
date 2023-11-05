import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import {isAuth} from "../auth/authUtils";
// import "../styles/header.css"; // Import your CSS file for styling

function Homepage() {

    const navigate = useNavigate();
    function checkAuth() {
        isAuth()
            .then((isAuthorized) => {
                if(!isAuthorized){
                    navigate("/login")
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    checkAuth();


    return (
        <div className="container">
            HOMEPAGE
        </div>
    );
}

export default Homepage;