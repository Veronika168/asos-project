// PasswordRecovery.js

import React, { useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import '../styles/auth.css'; // Ensure to import your CSS file

const PasswordRecovery = () => {
    const [email, setEmail] = useState('');
    const [verificationCodeStatus, setVerificationCodeStatus] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordCheck, setNewPasswordCheck] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const requestPasswordReset = async () => {
        // Send a request to your Node.js server to initiate the password reset
        // Include the user's email in the request body
        try {
            const response = await fetch('http://localhost:3001/auth/api/password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                console.log("OK RESPONSE")
                setVerificationCodeStatus(true)
            } else {
                // Handle other status codes, e.g., show an error message
                const errorData = await response.json();
                // console.log(errorData.message)
                // console.error('Error initiating password reset:', response.status);
                setErrorMessage(errorData.message)
            }
        } catch (error) {
            console.error('Error initiating password reset:', error);
        }
    };

    const resetPassword = async () => {
        // Send a request to your Node.js server to complete the password reset
        // Include email, verificationCode, and newPassword in the request body
        try {
            const response = await fetch('http://localhost:3001/auth/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, verificationCode, newPassword, newPasswordCheck}),
            });

            if (response.ok) {
                console.log("OK RESPONSE")
                navigate("/login", {state : {passwordResetStatus : true }})
            } else {
                const errorData = await response.json();
                // console.log(errorData.message)
                // console.error('Error initiating password reset:', response.status);
                setErrorMessage(errorData.message)
            }

            // Handle the response, e.g., show a success message
        } catch (error) {
            console.error('Error resetting password:', error);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="login-form">
                    {!verificationCodeStatus ? (
                        <>
                            <h2>Password Recovery</h2>
                            <label>Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button onClick={requestPasswordReset} className="btn btn-primary">
                                Request Password Reset
                            </button>
                        </>
                    ) : (
                        <div>
                            <label>Verification Code:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                            <label>New Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <label>Re-enter new Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPasswordCheck}
                                onChange={(e) => setNewPasswordCheck(e.target.value)}
                            />
                            <div>
                                {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}
                            </div>
                            <button onClick={resetPassword} className="btn btn-primary">
                                Reset Password
                            </button>
                        </div>
                    )}
                    {/* Other elements from your existing login form */}
                    {/* ... */}
                    <div>
                        <Link to="/register" className="btn btn-secondary">
                            SignUp
                        </Link>
                    </div>
                    <div>
                        <Link to="/passwordrecovery" className="btn btn-secondary">
                            Password Recovery
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordRecovery;
