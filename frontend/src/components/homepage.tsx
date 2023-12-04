import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import {isAuth} from "../auth/authUtils";
import '../styles/auth.css'; // Ensure to import your CSS file

function Homepage() {

    const navigate = useNavigate();

    // YOUTUBE DATA
    const [youtubeViews, setYoutubeViews] = useState('');
    const [youtubeSubs, setYoutubeSubs] = useState('');
    const [youtubeVideoCount, setYoutubeVideoCount] = useState('');

    //FACEBOOK DATA
    const [facebookLikes, setFacebookLikes] = useState('');
    const [facebookComments, setFacebookComments] = useState('');
    const [facebookShares, setFacebookShares] = useState('');
    const [facebookFollowers, setFacebookFollowers] = useState('');

    //INSTAGRAM DATA
    const [instagramImpressions, setInstagramImpressions] = useState('');
    const [instagramProfileViews, setInstagramProfileViews] = useState('');
    const [instagramFollowers, setInstagramFollowers] = useState('');

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
    async function getYoutubeData() {
        try {
            let authToken = localStorage.getItem('authToken')
            // console.log(authToken)
            const response = await fetch(`http://localhost:3001/api/youtubeApiData?authToken=${authToken}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                // DATA
                // console.log(data.youtubeInfo)
                // console.log(data.youtubeInfo.views)
                // console.log(data.youtubeInfo.subs)
                // console.log(data.youtubeInfo.videoCount)
                setYoutubeViews(data.youtubeInfo.views)
                setYoutubeSubs(data.youtubeInfo.subs)
                setYoutubeVideoCount(data.youtubeInfo.videoCount)
            } else {
                const errorData = await response.json();
                console.log(errorData.message)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    getYoutubeData()

    async function getFacebookData() {
        try {
            let authToken = localStorage.getItem('authToken');
            // console.log(authToken);
            const response = await fetch(`http://localhost:3001/api/facebookApiData?authToken=${authToken}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                // DATA
                //console.log(data.facebookInfo);
                // console.log(data.facebookInfo.likes)
                // console.log(data.facebookInfo.comments)
                // console.log(data.facebookInfo.shares)
                // console.log(data.facebookInfo.followers)
                setFacebookLikes(data.facebookInfo.likes)
                setFacebookComments(data.facebookInfo.comments)
                setFacebookShares(data.facebookInfo.shares)
                setFacebookFollowers(data.facebookInfo.followers)

            } else {
                const errorData = await response.json();
                console.log(errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    getFacebookData();

    async function getInstagramData() {
        try {
            let authToken = localStorage.getItem('authToken');
            // console.log(authToken);
            const response = await fetch(`http://localhost:3001/api/instagramApiData?authToken=${authToken}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                // DATA
                // console.log(data.instagramInfo);
                // console.log(data.instagramInfo.impressions)
                // console.log(data.instagramInfo.profileViews)
                // console.log(data.instagramInfo.followers)
                setInstagramImpressions(data.instagramInfo.impressions)
                setInstagramProfileViews(data.instagramInfo.profileViews)
                setInstagramFollowers(data.instagramInfo.followers)
            } else {
                const errorData = await response.json();
                console.log(errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    getInstagramData();

    return (
        <div className="container">
            HOMEPAGE
        </div>
    );
}

export default Homepage;