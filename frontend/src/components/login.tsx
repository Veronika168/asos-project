import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/login.css'; // Import your CSS file for styling

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // TODO - Obnova hesla, pravdepodobne nový page

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
                // TODO - Odpoveď od servera spracovať
                console.log(response)
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
                            <button type="submit" className="btn btn-primary">Login</button>
                            <Link to="/register">
                                <button className="btn btn-secondary">SignUp</button>
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
