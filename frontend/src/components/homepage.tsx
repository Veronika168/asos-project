import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import {isAuth} from "../auth/authUtils";
import '../styles/auth.css'; // Ensure to import your CSS file

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