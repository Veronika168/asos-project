// PasswordRecovery.js

import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";

const PasswordRecovery = () => {
    const [email, setEmail] = useState('');
    const [verificationCodeStatus, setVerificationCodeStatus] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

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
                console.log(errorData.message)
                console.error('Error initiating password reset:', response.status);
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
                body: JSON.stringify({ email, verificationCode, newPassword }),
            });

            if (response.ok) {
                console.log("OK RESPONSE")
                navigate("/login", {state : {passwordResetStatus : true }})
            } else {
                const errorData = await response.json();
                console.log(errorData.message)
                console.error('Error initiating password reset:', response.status);
            }

            // Handle the response, e.g., show a success message
        } catch (error) {
            console.error('Error resetting password:', error);
        }
    };

    return (
        <div>
            {!verificationCodeStatus && (
                <><h2>Password Recovery</h2><label>Email:</label><input type="email" value={email}
                                                                        onChange={(e) => setEmail(e.target.value)}/>
                    <button onClick={requestPasswordReset}>Request Password Reset</button>
                </>
            )}

            {/* Additional UI for entering verification code and new password */}
            {verificationCodeStatus && (
                <div>
                    <label>Verification Code:</label>
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button onClick={resetPassword}>Reset Password</button>
                </div>
            )}
        </div>
    );
};

export default PasswordRecovery;
