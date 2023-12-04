import React from 'react';
import {Link, Typography} from "@mui/material";

interface NavItemProps {
    url: string
    text: string
}
const NavItem = (props: NavItemProps) => {

    const { url, text } = props

    return(
        <Link href={url} sx={{
            textDecoration: 'none'
        }}>
            <Typography sx={{
                color: 'white',
                fontSize: 18,
                ml: 2,
                mr: 2,
                fontWeight: 700
            }}>
                {text}
            </Typography>

        </Link>
    )
}

export default NavItem;