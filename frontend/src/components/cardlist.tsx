import React from "react";
import SingleCard from "./singlecard";
import {Grid, Stack} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

const CardList = ({data}: {data:any}) => {
        return (
            <Grid
                container
                gap={4}
                flexWrap={{lg: "nowrap"}}
                justifyContent={"center"}
                mb={4}
            >
                <Stack direction={'row'} spacing={4}>
                    <SingleCard
                        socialLogo={<FacebookIcon color={"primary"} fontSize="medium"/>}
                        followers={data.facebookFollowers}
                        bgTopColor={"var(--facebook)"}
                    />

                    <SingleCard
                        socialLogo={
                            <InstagramIcon
                                //   color={"secondary"}
                                fontSize="medium"
                                sx={{
                                    color: "var(--instagram-middle)",
                                }}
                            />
                        }
                        followers={data.instagramFollowers}
                        bgTopColor={
                            "linear-gradient(225deg,var(--instagram-end),var(--instagram-middle) 50.91%,var(--instagram-start) 100%)"
                        }
                    />

                    <SingleCard
                        socialLogo={
                            <YouTubeIcon sx={{color: "var(--youtube)"}} fontSize="medium"/>
                        }
                        followers={data.youtubeSubs}
                        bgTopColor={"var(--youtube)"}
                    />
                </Stack>
            </Grid>
        );
}

export default CardList;
