import React, {useEffect, useState} from 'react';
import {Alert, AlertProps, Box, Button, Grid, IconButton, TextField, Typography} from "@mui/material";

import cl from './Registration.module.css';
import {useDispatch} from "react-redux";
import {login} from "../../redux/store/user/slice";
import {useNavigate} from "react-router";
import {PATH} from "../../routes";
import {Api, Register} from "../../api/Api";
import CloseIcon from "@mui/icons-material/Close";

const Registration = () => {

    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setREPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [messageHandler, setMessageHandler] = useState({type: "" as AlertProps["severity"], message: ""});

    const navigate = useNavigate();

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleChangePass = (e) => {
        setPassword(e.target.value);
    }

    const handleChangeFirstName = (e) => {
        setFirstName(e.target.value);
    }

    const handleChangeLastName = (e) => {
        setLastName(e.target.value);
    }

    const handleChangePhone = (e) => {
        setPhone(e.target.value);
    }

    const handleChangeREPass = (e) => {
        setREPassword(e.target.value);
    }

    useEffect(()=>{
        if(messageHandler.message.length > 0)
            setMessageHandler({...messageHandler, message: ""});
    }, [repassword])

    const register = () => {
        if(repassword !== password)
        {
            setMessageHandler({type: "error", message: "Паролі не співпадають!"});
            return;
        }


        const body = {email: email, password: password, repeated_password: repassword, phone: phone, last_name: lastName, first_name: firstName} as Register
        const promises = [];
        const api = new Api();
        const promise1 = new Promise((resolve, reject) => {
            api.register(body).then(res => {
                setMessageHandler({type: "success", message: "Зареєстровано."})
                resolve(true);
            }).catch(err => {
                setMessageHandler({type: "error", message: err})
                reject(err);
            });
        })

        promises.push(promise1);

        Promise.all(promises).then().catch();
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
                    <Typography className={cl.text}>Реєстрація</Typography>
                    <Box className={cl.inputs__content}>
                        <TextField variant={"filled"} onChange={handleChangeEmail} label={"Email"} value={email} placeholder={"Введіть email"}/>
                        <TextField variant={"filled"} className={cl.required} onChange={handleChangePass} label={"Пароль"} value={password} placeholder={"Введіть пароль"}/>
                        <TextField variant={"filled"} className={cl.required} onChange={handleChangeREPass} label={"RE-Пароль"} value={repassword} placeholder={"Введіть RE-пароль"}/>
                        <TextField variant={"filled"} className={cl.required} onChange={handleChangePhone} label={"Номер телефону"} value={phone} placeholder={"Введіть номер телефону"}/>
                        <TextField variant={"filled"} className={cl.required} onChange={handleChangeFirstName} label={"Ім'я"} value={firstName} placeholder={"Введіть ім'я"}/>
                        <TextField variant={"filled"} className={cl.required} onChange={handleChangeLastName} label={"Прізвище"} value={lastName} placeholder={"Введіть прізвище"}/>
                    </Box>
                    <Box width={"30%"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
                        <Button sx={{width:"100%", background:"#5d5a73", "&:hover":{background:"#28244d;"}, fontWeight:"600"}} variant={"contained"} disabled={password.length < 1 || repassword.length < 1 || phone.length < 1 || firstName.length < 1 || lastName.length < 1} onClick={register}>
                            Зареєструватися
                        </Button>
                        <Box onClick={e=>navigate(PATH.AUTHORIZATION)} sx={{fontSize:"14px", cursor:"pointer", "&:hover":{color:"red"}}}>
                            Вже маєте акаунт?
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Registration;