import React, {Component} from "react";
import SingleCard2 from "./singlecard2";
import {Grid, Stack} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

const CardList2 = ({data}: {
    data: any
}) => {
    return (
        <Grid>
            <Grid
                container
                gap={4}
                flexWrap={{lg: "nowrap"}}
                justifyContent={"center"}
            >
                <Stack direction={'column'} spacing={2}>
                    <SingleCard2
                        socialLogo={<FacebookIcon color={"primary"} fontSize="medium"/>}
                        socialName={"Likes"}
                        followers={data.facebookLikes}
                        bgTopColor={"var(--facebook)"}
                    />

                    <SingleCard2
                        socialLogo={<FacebookIcon color={"primary"} fontSize="medium"/>}
                        socialName={"Comments"}
                        followers={data.facebookComments}
                        bgTopColor={"var(--facebook)"}
                    />

                    <SingleCard2
                        socialLogo={<FacebookIcon color={"primary"} fontSize="medium"/>}
                        socialName={"Shares"}
                        followers={data.facebookShares}
                        bgTopColor={"var(--facebook)"}
                    />
                </Stack>
                <Stack direction={'column'} spacing={2}>
                    <SingleCard2
                        socialLogo={
                            <InstagramIcon
                                //   color={"secondary"}
                                fontSize="medium"
                                sx={{
                                    color: "var(--instagram-middle)",
                                }}
                            />
                        }
                        socialName={"Impressions"}
                        followers={data.instagramImpressions}
                        bgTopColor={
                            "linear-gradient(225deg,var(--instagram-end),var(--instagram-middle) 50.91%,var(--instagram-start) 100%)"
                        }
                    />

                    <SingleCard2
                        socialLogo={
                            <InstagramIcon
                                sx={{
                                    color: "var(--instagram-middle)",
                                }}
                                fontSize="medium"
                            />
                        }
                        socialName={"Profile Views"}
                        followers={data.instagramProfileViews}
                        bgTopColor={"var(--youtube)"}
                    />
                </Stack>
                <Stack direction={'column'} spacing={2}>
                    <SingleCard2
                        socialLogo={
                            <YouTubeIcon
                                fontSize="medium"
                                sx={{color: "var(--youtube)"}}
                            />
                        }
                        socialName={"Views"}
                        followers={data.youtubeViews}
                        bgTopColor={
                            "linear-gradient(225deg,var(--instagram-end),var(--instagram-middle) 50.91%,var(--instagram-start) 100%)"
                        }
                    />

                    <SingleCard2
                        socialLogo={
                            <YouTubeIcon
                                sx={{color: "var(--youtube)"}}
                                fontSize="medium"
                            />
                        }
                        socialName={"Video Count"}
                        followers={data.youtubeVideoCount}
                        bgTopColor={"var(--youtube)"}
                    />
                </Stack>
            </Grid>
        </Grid>
    );

}

export default CardList2;