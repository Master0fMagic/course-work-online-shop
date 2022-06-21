import React, {useEffect, useState} from 'react';
import {AppBar, Badge, Box, IconButton, Menu, MenuItem} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import cl from './Header.module.css'
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../../redux/store/user/slice";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {Typography} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {useNavigate} from "react-router";
import {PATH} from "../../../routes";
import {SelectUserAuth, SelectUserItems} from "../../../redux/store/user/selector";
import ModalCreateOrder from "../../../pages/About/components/ModalCreateOrder";
import ModalOrder from "../../../pages/About/components/ModalOrder";

const Header = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [cartState, setCartState] = useState(false);

    const items = useSelector(SelectUserItems);

    const logoutAct = () => {
        dispatch(logout());
    }

    const auth = useSelector(SelectUserAuth);

    return (
        <Box width={"100%"}>
            <ModalOrder open={cartState} setModal={setCartState}/>
            <AppBar position={"sticky"} sx={{padding:"10px", backgroundColor: "#9fa4c4", backgroundImage:"linear-gradient(315deg, #9fa4c4 0%, #9e768f 74%)"}}>
                <Box display={"flex"} justifyContent={"space-around"} alignItems={"center"}>
                    <Typography
                        onClick={e => navigate(PATH.PRODUCTS)}
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{display: "block", "&:hover": {cursor: "pointer"}}}
                    >
                        Каталог
                    </Typography>
                    <Typography
                        onClick={e => navigate(PATH.ORDERS)}
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{display: auth ? "block" : "none", "&:hover": {cursor: "pointer"}}}
                    >
                        Мої замовлення
                    </Typography>
                    <Typography
                        onClick={logoutAct}
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{display: auth ? "block" : "none", "&:hover": {cursor: "pointer"}}}
                    >
                        Вийти
                    </Typography>
                    <Typography
                        onClick={e => navigate(PATH.AUTHORIZATION)}
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{display: auth ? "none" : "block", "&:hover": {cursor: "pointer"}}}
                    >
                        Увійти
                    </Typography>
                    <Badge badgeContent={items.length} sx={{"& > span":{background:"#f27d7d", top:"5px"}}}>
                        <IconButton sx={{"& path":{fill:"#A4508B"}}} onClick={e=>setCartState(true)}>
                            <ShoppingCartIcon/>
                        </IconButton>
                    </Badge>
                </Box>
            </AppBar>
        </Box>
    );
};

export default Header;