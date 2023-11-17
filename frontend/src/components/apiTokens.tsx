import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useNavigate} from 'react-router-dom';
import {isAuth} from '../auth/authUtils';
import '../styles/token.css'; // Ensure to import your CSS file

function ApiTokens() {
    const navigate = useNavigate();
    const [twitterToken, setTwitterToken] = useState('');

    function checkAuth() {
        isAuth()
            .then((isAuthorized) => {
                if (!isAuthorized) {
                    navigate('/login');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function handleTokenChange(event: { target: { value: React.SetStateAction<string>; }; }) {
        // Update state with the user's input for the Twitter token
        setTwitterToken(event.target.value);
    }

    function redirectToTwitter() {
        // Redirect the user to the Twitter token generation page
        window.open('https://twitter.com/settings/applications', '_blank');
    }

    checkAuth();

    return (
        <div className="container-token">
            <div className="row justify-content-center">
                <div className="token-frame">
                    <h2>Twitter API Tokens</h2>
                    <form>
                        <div className="form-group mb-3">
                            <label htmlFor="twitterToken" className="form-label">
                                Enter Twitter API Token:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="twitterToken"
                                value={twitterToken}
                                onChange={handleTokenChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </form>
                    <p>
                        Need to generate a Twitter API token?{' '}
                        <a href="https://twitter.com/settings/applications" target="_blank" rel="noopener noreferrer">
                            Click here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ApiTokens;
