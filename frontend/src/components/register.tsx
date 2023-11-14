import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/register.css'; // Import your CSS file for styling

function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        // You can use a fetch or Axios to send a POST request to your server
        try {
            const response = await fetch('http://localhost:3001/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, email, password, passwordCheck}),
            });

            if (response.ok) {
                navigate("/login", {state : {registrationStatus : true }})
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="login-form">
                    <h2>Registration</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="passwordCheck">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="passwordCheck"
                                value={passwordCheck}
                                onChange={(e) => setPasswordCheck(e.target.value)}
                            />
                        </div>
                        <div>
                            {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}
                        </div>
                        <button type="submit" className="btn btn-primary">Register</button>
                        <Link to="/">
                            <button className="btn btn-secondary">Login</button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
