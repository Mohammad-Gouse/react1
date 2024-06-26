import { Box, Typography } from '@mui/material'
import React from 'react'
import { Favorite } from '@mui/icons-material'

const Footer = () => {
    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                marginTop={3}
                padding={1}
                backgroundColor="#242056"
                width="100%"
                position="fixed"
                bottom="0"
            >
                <Typography style={{ color: "#fff", fontSize: "13px", display: "flex", alignItems: "center" }} >Made with
                    <Favorite style={{ fill: "red", fontSize: "17px", marginLeft: "6px", marginRight: "6px" }} />
                    by
                    <a href="https://www.texple.com/"
                        target="_blank"
                        style={{
                            marginLeft: "4px",
                            textDecoration: "none",
                            cursor: "pointer",
                            // fontWeight: "1000",
                            color: "#fff",
                        }}
                    >
                        Texple
                    </a>
                </Typography>
            </Box>
        </>
    )
}

export default Footer