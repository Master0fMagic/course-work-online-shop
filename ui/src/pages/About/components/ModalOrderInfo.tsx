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
import ModalCreateOrder from "./ModalCreateOrder";
import {GetProducts} from "../../../api/Api";

export type OrderTypeModal = {
    number: number,
    items: GetProducts[]
}

const ModalOrder = ({open, setModal, order}) => {

    const [modalOrder, setModalOrder] = useState(false);

    const newTheme = createTheme({
        palette: {
            primary: {
                main: "#A4508B"
            }
        }
    })

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
                    <h2 id="parent-modal-title">Ваше замовлення №{order && order.number}</h2>
                    <TableContainer component={Paper}
                                    sx={{maxHeight: "500px", overflowY: "auto"}}>
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
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order && order.items.map((item, index) => (
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
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={6} align={"right"}>
                                        Сума замовлення: {order && order.items.reduce((partialSum, a) => partialSum + a.price, 0)}грн
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </ThemeProvider>
        </Modal>
    );
};

export default ModalOrder;