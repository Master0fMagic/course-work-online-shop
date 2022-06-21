import React, {useState} from 'react';
import {
    Box,
    Button, createTheme, IconButton,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, ThemeProvider, Tooltip
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {SelectUserAuth, SelectUserItems} from "../../../redux/store/user/selector";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {setItems} from "../../../redux/store/user/slice";
import ModalCreateOrder from "./ModalCreateOrder";

const ModalOrder = ({open, setModal}) => {

    const [modalOrder, setModalOrder] = useState(false);

    const newTheme = createTheme({
        palette: {
            primary: {
                main: "#A4508B"
            }
        }
    })

    const dispatch = useDispatch();

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

    const items = useSelector(SelectUserItems);

    const removeItem = (index, length = 1) => {
        const tempItems = Array.from(items);
        const newList = tempItems.splice(index, length);
        dispatch(setItems(tempItems));
    }

    const auth = useSelector(SelectUserAuth);

    const createOrder = () => {
        setModalOrder(true);
    }

    return (
        <Modal
            open={open}
            onClose={e => setModal(false)}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <ThemeProvider theme={newTheme}>
                <ModalCreateOrder open={modalOrder} setModal={setModalOrder}/>
                <Box sx={{
                    ...style,
                    minHeight: "600px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: 800
                }}>
                    <h2 id="parent-modal-title">Ваш список замовлень {items.length === 0 && "пустий!"}</h2>
                    <TableContainer component={Paper}
                                    sx={{display: items.length === 0 && "none", maxHeight: "500px", overflowY: "auto"}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        №
                                    </TableCell>
                                    <TableCell>
                                        Назва товару
                                    </TableCell>
                                    <TableCell>
                                        Категорія
                                    </TableCell>
                                    <TableCell>
                                        Опис (опціонально)
                                    </TableCell>
                                    <TableCell>
                                        Ціна (грн)
                                    </TableCell>
                                    <TableCell>
                                        Видалити
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell width={"10%"}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            {item.name}
                                        </TableCell>
                                        <TableCell>
                                            {item.category}
                                        </TableCell>
                                        <TableCell>
                                            {item.description}
                                        </TableCell>
                                        <TableCell>
                                            {item.price} грн
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            <IconButton color={"primary"} onClick={e => removeItem(index)}>
                                                <RemoveCircleOutlineIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={6} align={"right"}>
                                        Сума замовлення: {items.reduce((partialSum, a) => partialSum + a.price, 0)}грн
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box marginTop={"10px"} display={items.length > 0 ? "flex" : "none"}
                         justifyContent={"space-around"}>
                        <Tooltip title={auth ? "" : "Для цього ви повинні бути авторизовані"}>
                            <span>
                                <Button onClick={createOrder} disabled={!auth} color={"primary"} sx={{marginRight: "15px"}} variant={"contained"}>
                                    Підтвердити замовлення
                                </Button>
                            </span>
                        </Tooltip>
                        <Button color={"primary"} variant={"contained"} onClick={e => removeItem(0, items.length)}>
                            Скасувати замовлення
                        </Button>
                    </Box>
                </Box>
            </ThemeProvider>
        </Modal>
    );
};

export default ModalOrder;