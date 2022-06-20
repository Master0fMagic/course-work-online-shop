import {Outlet, useLocation} from "react-router-dom";
import {
    Box,
} from "@mui/material";
import Header from "./Header/Header";

import cl from './Layout.module.css';
import React, {useEffect, useState} from "react";

const Layout = () => {
    return (
        <Box className={`${cl.container}`}>
            <Header/>
            <Box className={cl.content}>
                <Outlet/>
            </Box>
        </Box>
    );
};

export default Layout;