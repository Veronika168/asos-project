import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useNavigate} from 'react-router-dom';
import {isAuth} from '../auth/authUtils';
import '../styles/token.css';
import axios from "axios"; // Ensure to import your CSS file

function ApiTokens() {
    const navigate = useNavigate();
    const [youtubeToken, setYoutubeToken] = useState('');
    const [facebookToken, setFacebookToken] = useState('');
    const [instagramToken, setInstagramToken] = useState('');
    const [errorMessageYt, setErrorMessageYt] = useState('');
    const [successMessageYt, setSuccesssMessageYt] = useState('');
    const [errorMessageFb, setErrorMessageFb] = useState('');
    const [successMessageFb, setSuccesssMessageFb] = useState('');
    const [errorMessageIg, setErrorMessageIg] = useState('');
    const [successMessageIg, setSuccesssMessageIg] = useState('');

    let loggedUsername = '';
    function checkAuth() {
        isAuth()
            .then((isAuthorized) => {
                if (!isAuthorized) {
                    navigate('/login');
                }else{
                    loggedUsername = isAuthorized.username;
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    checkAuth();

    const handleYoutubeTokenChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setYoutubeToken(e.target.value);
    };

    const handleFacebookTokenChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setFacebookToken(e.target.value);
    };

    const handleInstagramTokenChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setInstagramToken(e.target.value);
    };

    const handleSubmitYt = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // Handle submission of tokens here
        // You can make API requests or perform other actions with the tokens

        try {
            const response = await axios.post('http://localhost:3001/api/new/youtube', {youtubeToken, loggedUsername});
            if (response.status === 200) {
                // Key saved successfully on the server, proceed with further actions or show success message
                //console.log("Response is OK")
                setSuccesssMessageYt('Token added successfully !')
                setErrorMessageYt('')
            } else {
                // Handle other responses or show error messages
                //console.log("Response IS NOT OK")
                setSuccesssMessageYt('')
                setErrorMessageYt('Invalid token/s !')
            }
        } catch (error) {
            // Handle errors
            setSuccesssMessageYt('')
            setErrorMessageYt('Invalid token/s!')
            console.log(error)
        }

    };

    const handleDeleteYt = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            console.log(authToken)

            const response = await fetch(`http://localhost:3001/api/delete/youtube?authToken=${authToken}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                // Ak bol záznam úspešne odstránený, zobrazte správu o úspechu
                setSuccesssMessageYt('API Deleted');
                setErrorMessageYt(''); // V prípade úspechu vymažte chybovú správu
                console.log(data.message); // Prípadne spracovanie správy pre používateľa
            } else {
                // Ak sa vyskytla chyba, zobrazte správu o chybe
                setErrorMessageYt('API Was not deleted ERROR');
                setSuccesssMessageYt(''); // V prípade chyby vymažte úspešnú správu
                console.error(data.message); // Prípadne spracovanie správy pre používateľa
            }
        } catch (error) {
            console.error('Error deleting YouTube API data:', error);
        }
    };

    // Nová funkcia na získanie statusu YouTube API
    const handleGetYtStatus = async () => {
        try {
            // Tu získajte authToken podľa vášho aktuálneho postupu získavania autentifikácie
            const authToken = localStorage.getItem('authToken');

            const response = await fetch(`http://localhost:3001/api/youtubeApiData?authToken=${authToken}`);
            const data = await response.json();

            if (response.ok) {
                // Ak je API ready, aktualizujte successMessageYt
                setSuccesssMessageYt('API Ready');
                setErrorMessageYt(''); // V prípade úspechu vymažte chybovú správu
                console.log("OK STATUS"); // Prípadne spracovanie správy pre používateľa
            } else {
                // Ak API nie je ready, aktualizujte errorMessageYt
                setErrorMessageYt('API Is not ready');
                setSuccesssMessageYt(''); // V prípade chyby vymažte úspešnú správu
                console.error("NOT OK STATUS"); // Prípadne spracovanie správy pre používateľa
            }
        } catch (error) {
            console.error('Error getting YouTube API status:', error);
        }
    };

    // --------------------
    // --------------------
    // --------------------

    const handleSubmitFb = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setSuccesssMessageFb('')
        setErrorMessageFb('Facebook API is right now in maintenance, we are very sorry.')
    };

    // --------------------
    // --------------------
    // --------------------

    const handleSubmitIg = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setSuccesssMessageIg('')
        setErrorMessageIg('Instagram API is right now in maintenance, we are very sorry.')
    };


    return (
        <div>
            <div className="container-token">
                <div className="row justify-content-center">
                    <div className="token-frame">
                        <h2>YouTube API</h2>
                        <form onSubmit={handleSubmitYt}>
                            <div className="form-group mb-3">
                                <label htmlFor="youtubeToken" className="form-label">
                                    Enter YouTube Access Token:
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="youtubeToken"
                                    value={youtubeToken}
                                    onChange={handleYoutubeTokenChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Submit Token
                            </button>
                        </form>

                        <button onClick={handleDeleteYt} className="btn btn-danger">
                            Delete YouTube API Data
                        </button>

                        {/* Tlačidlo pre získanie statusu YouTube API */}
                        <button onClick={handleGetYtStatus} className="btn btn-info">
                            Status
                        </button>

                        <div>
                            {errorMessageYt && <p style={{color: "red"}}>{errorMessageYt}</p>}
                        </div>
                        <div>
                            {successMessageYt && <p style={{color: "green"}}>{successMessageYt}</p>}
                        </div>

                        <p>
                            Need to generate API tokens?
                            <br />
                            For YouTube, visit{' '}
                            <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer">
                                Google Developers Console
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <div className="container-token">
                <div className="row justify-content-center">
                    <div className="token-frame">
                        <h2>Facebook API</h2>
                        <form onSubmit={handleSubmitFb}>
                            <div className="form-group mb-3">
                                <label htmlFor="facebookToken" className="form-label">
                                    Enter Facebook Access Token:
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="facebookToken"
                                    value={facebookToken}
                                    onChange={handleFacebookTokenChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Submit Token
                            </button>
                        </form>

                        <button onClick={handleSubmitFb} className="btn btn-danger">
                            Delete Facebook API Data
                        </button>

                        {/* Tlačidlo pre získanie statusu YouTube API */}
                        <button onClick={handleSubmitFb} className="btn btn-info">
                            Status
                        </button>

                        <div>
                            {errorMessageFb && <p style={{color: "red"}}>{errorMessageFb}</p>}
                        </div>
                        <div>
                            {successMessageFb && <p style={{color: "green"}}>{successMessageFb}</p>}
                        </div>

                        <p>
                            Need to generate API tokens?
                            <br />
                            For Facebook, visit{' '}
                            <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer">
                                Facebook for Developers
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <div className="container-token">
                <div className="row justify-content-center">
                    <div className="token-frame">
                        <h2>Instagram API</h2>
                        <form onSubmit={handleSubmitIg}>
                            <div className="form-group mb-3">
                                <label htmlFor="instagramToken" className="form-label">
                                    Enter Instagram Access Token:
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="instagramToken"
                                    value={instagramToken}
                                    onChange={handleInstagramTokenChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Submit Token
                            </button>
                        </form>

                        <button onClick={handleSubmitIg} className="btn btn-danger">
                            Delete Instagram API Data
                        </button>

                        {/* Tlačidlo pre získanie statusu YouTube API */}
                        <button onClick={handleSubmitIg} className="btn btn-info">
                            Status
                        </button>

                        <div>
                            {errorMessageIg && <p style={{color: "red"}}>{errorMessageIg}</p>}
                        </div>
                        <div>
                            {successMessageIg && <p style={{color: "green"}}>{successMessageIg}</p>}
                        </div>

                        <p>
                            Need to generate API tokens?
                            <br />
                            For Instagram, visit{' '}
                            <a href="https://www.instagram.com/developer/" target="_blank" rel="noopener noreferrer">
                                Instagram Developer
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApiTokens;
