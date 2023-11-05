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
    const [secondsRemaining, setSecondsRemaining] = useState(300); // 2 minutes
    const [registrationStatus, setRegistrationStatus] = useState('notStarted');
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        // You can use a fetch or Axios to send a POST request to your server
        try {
            console.log("registration")
            console.log(username)
            const response = await fetch('http://localhost:3001/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, email, password, passwordCheck}),
            });

            if (response.ok) {
                navigate("/login")
                setRegistrationStatus('success');
            } else {
                // TODO - Odpoveď od servera spracovať
                console.log(response)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // useEffect(() => {
    //     if (registrationStatus === 'success') {
    //         // Set the QR code data URL only when registrationStatus changes to 'success'
    //         axios.post('http://localhost:3001/auth/generate-qr-code')
    //             .then((response) => {
    //                 console.log("okeeee")
    //                 setQrCodeDataUrl(response.data.qrCodeDataUrl);
    //             })
    //             .catch((error) => {
    //                 console.error('Error fetching QR code:', error);
    //             });
    //     }
    // }, [registrationStatus]); // This effect will run when registrationStatus changes
    //
    // useEffect(() => {
    //     if (registrationStatus === 'success' && secondsRemaining > 0) {
    //         const timer = setTimeout(() => {
    //             setSecondsRemaining(secondsRemaining - 1);
    //         }, 1000);
    //
    //         return () => clearTimeout(timer);
    //     } else if (registrationStatus === 'success' && secondsRemaining === 0) {
    //         // Time's up, navigate to /login
    //         navigate("/login");
    //     }
    // }, [registrationStatus, secondsRemaining]); // This effect depends on both registrationStatus and secondsRemaining


    return (
        <div className="container">
            <div className="row justify-content-center">
                <div>
                    <div>
                        {registrationStatus === 'notStarted' && (
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
                                    <button type="submit" className="btn btn-primary">Register</button>
                                    <Link to="/">
                                        <button className="btn btn-secondary">Login</button>
                                    </Link>
                                </form>
                            </div>
                        )}

                        {/*{registrationStatus === 'success' && (*/}
                        {/*    <div>*/}
                        {/*        <h2>Registration Successful</h2>*/}
                        {/*        <div>*/}
                        {/*            {qrCodeDataUrl ? (*/}
                        {/*                <img src={qrCodeDataUrl} alt="QR Code" />*/}
                        {/*            ) : (*/}
                        {/*                <p>Loading QR code...</p>*/}
                        {/*            )}*/}
                        {/*        </div>*/}
                        {/*        <p>Timer: {secondsRemaining} seconds</p>*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
