import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import {isAuth} from "../auth/authUtils";
import { Grid, Typography } from "@mui/material";
//import '../styles/auth.css'; // Ensure to import your CSS file
import "../styles/style.scss";
import CardList from "./cardlist";
import CardList2 from "./cardlist2";

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
                setYoutubeViews(data.youtubeInfo.views)
                setYoutubeSubs(data.youtubeInfo.subs)
                setYoutubeVideoCount(data.youtubeInfo.videoCount)
            } else {
                const errorData = await response.json();
                console.log(errorData.message)
                setYoutubeViews('0')
                setYoutubeSubs('0')
                setYoutubeVideoCount('0')
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
                setFacebookLikes(data.facebookInfo.likes)
                setFacebookComments(data.facebookInfo.comments)
                setFacebookShares(data.facebookInfo.shares)
                setFacebookFollowers(data.facebookInfo.followers)

            } else {
                const errorData = await response.json();
                console.log(errorData.message);
                setFacebookLikes('0')
                setFacebookComments('0')
                setFacebookShares('0')
                setFacebookFollowers('0')
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
                setInstagramImpressions(data.instagramInfo.impressions)
                setInstagramProfileViews(data.instagramInfo.profileViews)
                setInstagramFollowers(data.instagramInfo.followers)
            } else {
                const errorData = await response.json();
                console.log(errorData.message);
                setInstagramImpressions('0')
                setInstagramProfileViews('0')
                setInstagramFollowers('0')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    getInstagramData();

    return (
        <div>
            <Grid sx={{ maxWidth: "1400px", margin: "50px auto" }}>
                <section>
                    <CardList data={{
                        youtubeSubs: youtubeSubs,
                        facebookFollowers: facebookFollowers,
                        instagramFollowers: instagramFollowers
                    }}/>
                </section>
                <section>
                    <CardList2 data={{
                        youtubeViews: youtubeViews,
                        youtubeVideoCount: youtubeVideoCount,
                        facebookLikes: facebookLikes,
                        facebookComments: facebookComments,
                        facebookShares: facebookShares,
                        instagramImpressions: instagramImpressions,
                        instagramProfileViews: instagramProfileViews
                    }}></CardList2>
                </section>
            </Grid>
        </div>
    );
}

export default Homepage;