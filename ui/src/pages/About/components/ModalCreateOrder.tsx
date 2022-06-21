import React, {useEffect, useState} from 'react';
import {Api, GetDeliviries, PostItem, PostOrder} from "../../../api/Api";
import {
    Alert, AlertProps,
    Box,
    Button, CircularProgress, FormControl, Grid, IconButton, InputLabel, MenuItem,
    Modal,
    Paper, Select, Step, StepButton, Stepper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow, TextField,
    Typography
} from "@mui/material";
import moment from "moment";
import {LocalizationProvider, MobileDatePicker} from '@mui/x-date-pickers';
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import CloseIcon from "@mui/icons-material/Close";
import {useDispatch, useSelector} from "react-redux";
import {SelectUserItems} from "../../../redux/store/user/selector";
import {setItems} from "../../../redux/store/user/slice";

const ModalCreateOrder = ({open, setModal}) => {
    const [messageHandler, setMessageHandler] = useState({type: "" as AlertProps["severity"], message: ""});
    const [delivery, setDelivery] = useState("Оберіть службу доставки");
    const [deliveries, setDeliviries] = useState<GetDeliviries[]>([]);
    const [address, setAddress] = useState("");

    useEffect(() => {
        getDeliviries();
    }, [])

    const getDeliviries = () => {
        setLoading(true);
        const api = new Api();
        api.getDealersCenter().then(res => {
            setDeliviries(res.data.data);
            setLoading(false);
        }).catch(err => {
            setMessageHandler({type: "error", message: err})
            setLoading(false);
        })
    }

    useEffect(() => {
        setMessageHandler({...messageHandler, message: ""});
        getDeliviries();
    }, [open])

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
        borderRadius: "10px"
    };

    const [loading, setLoading] = useState(false);
    const items = useSelector(SelectUserItems);
    const dispatch = useDispatch();

    const createOrder = () => {
        setLoading(true);
        const api = new Api();
        const data = {
            address: address, delivery_service_id: parseInt(delivery), items: items.map(i => {
                return {
                    product_id: i.id,
                    amount: 1
                } as PostItem
            })
        } as PostOrder;

        api.createOrder(data).then(res => {
            setMessageHandler({type: "success", message: "Заявку створено!"});
            setLoading(false);
            dispatch(setItems([]));
            setTimeout(() => {
                setModal(false);
            }, 1000);
        }).catch(err => {
            console.log(err)
            setLoading(false)
        });
    }

    return (
        <Modal
            open={open}
            onClose={e => setModal(false)}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{
                ...style,
                minHeight: "600px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                width: 800
            }}>
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
                <h2 id="parent-modal-title">Створення замовлення</h2>
                <Box>
                    <CircularProgress sx={{display: !loading && "none"}}/>
                    <FormControl sx={{display: loading && "none", margin: "40px 0px"}} fullWidth>
                        <TextField label={"Адреса доставки"} value={address} onChange={e => setAddress(e.target.value)}
                                   placeholder={"Введіть адресу доставки"}/>
                    </FormControl>
                    <FormControl sx={{display: loading && "none", margin: "40px 0px"}} fullWidth>
                        <InputLabel id="demo-simple-select-label">Служба доставки</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={delivery}
                            label="Служба доставки"
                            onChange={e => setDelivery(e.target.value)}
                        >
                            {deliveries.map((f, i) => (
                                <MenuItem key={f.id} value={f.id}>{f.name} ({f.price}грн)</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box display={"flex"} justifyContent={"center"}>
                        <Button variant={"contained"} onClick={createOrder}>Створити замовлення</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalCreateOrder;