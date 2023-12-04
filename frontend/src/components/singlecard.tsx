import React, {Component, ReactElement} from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {CardActionArea, Icon, Grid} from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const SingleCard = ({
                        socialLogo,
                        socialName,
                        followers,
                        followersToday,
                        bgTopColor,
                    }: {
    socialLogo: ReactElement,
    socialName: string,
    followers: string,
    followersToday: string,
    bgTopColor: any,
}) => {
    return (
        <Card
            sx={{
                minWidth: 270,
                bgcolor: "var(--card-bg)",
                boxShadow: "none",
            }}
        >
            <CardActionArea>
                {/*<CardMedia*/}
                {/*  sx={{ background: bgTopColor, border: "none", minHeight: "5px" }}*/}
                {/*  height="5"*/}
                {/*  className="card-top"*/}
                {/*/>*/}
                <CardContent>
                    <div className="top">
                        <Grid
                            fontSize={14}
                            className="social-logo"
                            container
                            justifyContent={"center"}
                            alignItems={"center"}
                            mb={"10px"}
                            gap={1}
                        >
                            {socialLogo}
                        </Grid>
                    </div>
                    <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        textAlign={"center"}
                        textTransform={"uppercase"}
                        fontWeight={700}
                        fontSize={65}
                        color={"var(--text-color)"}
                    >
                        {followers}
                        <Typography
                            color={"var(--text-color2)"}
                            fontWeight={"400"}
                            fontSize={"14px"}
                            letterSpacing={"5px"}
                        >
                            Followers
                        </Typography>
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};
export default SingleCard;
SingleCard.defaultProps = {
    socialLogo: "loading...",
    socialName: "loading...",
    followers: "loading...",
    followersToday: "loading...",
};

SingleCard.propTypes = {
    socialLogo: PropTypes.string,
    socialName: PropTypes.string,
    followers: PropTypes.string,
    followersToday: PropTypes.string,
};
