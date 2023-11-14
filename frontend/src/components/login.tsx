import React, { useState } from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/login.css'; // Import your CSS file for styling

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const registrationSuccess = location.state?.registrationStatus;
    const passwordResetSuccess = location.state?.passwordResetStatus;

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        // You can use a fetch or Axios to send a POST request to your server
        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password}),
            });

            if (response.ok) {
                const data = await response.json();
                const authToken = data.authToken;

                // Store the token securely, for example in localStorage
                localStorage.setItem('authToken', authToken);
                navigate("/homepage")
            } else {
                const errorData = await response.json();
                console.log(errorData.message)
                setErrorMessage(errorData.message)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div>
                    <div className="login-form">
                        <h2>Login</h2>
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
                                <label htmlFor="username">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}
                            </div>
                            <div>
                                {registrationSuccess && <p style={{color: "green"}}>Registration was successful!</p>}
                            </div>
                            <div>
                                {passwordResetSuccess && <p style={{color: "green"}}>Password reset was successful!</p>}
                            </div>
                            <button type="submit" className="btn btn-primary">Login</button>
                            <div>
                                <Link to="/register">
                                    <button className="btn btn-secondary">SignUp</button>
                                </Link>
                            </div>
                            <div>
                                <Link to="/passwordrecovery">
                                    <button className="btn btn-secondary">Password Recovery</button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
