import React, {useEffect, useState} from 'react';
import {Alert, AlertProps, Box, Button, Grid, IconButton, TextField, Typography} from "@mui/material";

import cl from './Authorization.module.css';
import {useDispatch, useSelector} from "react-redux";
import {login} from "../../redux/store/user/slice";
import {PATH} from "../../routes";
import {useNavigate} from "react-router";
import CloseIcon from "@mui/icons-material/Close";
import {SelectUserError} from "../../redux/store/user/selector";

const Authorization = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const err = useSelector(SelectUserError);
    const [messageHandler, setMessageHandler] = useState({type: "" as AlertProps["severity"], message: ""});
    const [loginU, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const handleChangeLogin = (e) => {
        setLogin(e.target.value);
    }

    const handleChangePass = (e) => {
        setPassword(e.target.value);
    }

    useEffect(()=>{
        setMessageHandler({type: "error", message: err})
    }, [err])

    const authorize = () => {
        dispatch(login({login: loginU, password: password}));
    }

    return (
        <Box className={cl.container}>
            <Grid sx={{marginBottom: "30px"}} item xs={12}>
                {messageHandler.message.length > 0 && <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setMessageHandler({...messageHandler, message: ""})
                            }}
                        >
                            <CloseIcon fontSize="inherit"/>
                        </IconButton>
                    }
                    severity={messageHandler.type}>{messageHandler.message}
                </Alert>}
            </Grid>
            <Box className={cl.window}>
                <Box className={cl.content}>
                    <Typography className={cl.text}>Вхід</Typography>
                    <Box className={cl.inputs__content}>
                        <TextField variant={"filled"} sx={{marginBottom:"10px"}} onChange={handleChangeLogin} label={"Логін"} value={loginU} placeholder={"Введіть свій номер чи email"}/>
                        <TextField variant={"filled"} onChange={handleChangePass} label={"Пароль"} value={password} placeholder={"Введіть свій пароль"}/>
                    </Box>
                    <Box width={"30%"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
                        <Button sx={{width:"100%", background:"#5d5a73", "&:hover":{background:"#28244d;"}, fontWeight:"600"}} variant={"contained"} disabled={password.length < 1 || loginU.length < 1} onClick={authorize}>
                            Увійти
                        </Button>
                        <Box onClick={e=>navigate(PATH.REGISTER)} sx={{fontSize:"14px", textAlign:"center", cursor:"pointer", "&:hover":{color:"red"}}}>
                            Не маєте аккаунту? Зареєструватись
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Authorization;