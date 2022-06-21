import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box, Card, CardActions, CardContent, CardHeader,
    CircularProgress, createTheme, Drawer,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Slider, Snackbar, ThemeProvider, Tooltip,
    Typography
} from "@mui/material";
import {Api, GetProducts} from "../../api/Api";
import {setItems} from "../../redux/store/user/slice";
import {useDispatch, useSelector} from "react-redux";

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {SelectUserItems} from "../../redux/store/user/selector";

const Catalog = () => {

    const dispatch = useDispatch();
    const items = useSelector(SelectUserItems);

    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState<GetProducts[]>([]);

    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("Оберіть тип товару");

    const [priceRange, setPriceRange] = useState([1, 100000])

    const [snackBar, setSnackBar] = useState(false);

    const newTheme = createTheme({
        palette: {
            primary: {
                main: "#A4508B",
            },
            secondary: {
                main: "#9E768F"
            },
            background: {
                default: "#9E768F",
                paper: "#9E768F"
            },
            text: {
                primary: "white",
                secondary: "white",
                disabled: "gray"
            }
        }
    })

    useEffect(() => {
        const api = new Api();
        try {
            setLoading(true);
            const promises = [];

            const promise1 = new Promise((resolve, reject) => {
                api.getProducts().then(res => {

                    const data = res.data.data;
                    const categories = new Array(...new Set(data.map(r => r.category)));
                    setCategories(["Оберіть тип товару", ...categories]);
                    setProducts([...res.data.data]);
                    resolve(true);
                }).catch(err => {
                    reject(err);
                });
            })

            promises.push(promise1);

            Promise.all(promises).then(e => setLoading(false)).catch(e => setLoading(false));

        } catch (e) {
            console.log(e)
        }
    }, [])

    const filterItems = () => {
        let itemsList = products;

        if (category !== "Оберіть тип товару")
            itemsList = itemsList.filter(x => x.category === category);

        itemsList = itemsList.filter(x => (x.price >= priceRange[0] && x.price <= priceRange[1]) || !x.price);

        return itemsList;
    }

    const handleChangeCategory = (e) => {
        setCategory(e.target.value);
    }

    const addToCart = (id) => {
        const tempProducts = Array.from(products);
        const newItem = tempProducts.splice(products.findIndex(x => x.id === id), 1);
        setSnackBar(true);
        dispatch(setItems([...items, newItem[0]]));
    }

    return (
        <Box>
            <Snackbar
                open={snackBar}
                autoHideDuration={1500}
                onClose={e => setSnackBar(false)}
            >
                <Alert severity={"success"}>
                    Додано у кошик
                </Alert>
            </Snackbar>
            <ThemeProvider theme={newTheme}>
                {loading ? <CircularProgress/> :
                    <Box color={"white"} display={"flex"} justifyContent={"space-between"}>
                        <Box width={"75%"}>
                            {/*<Typography fontSize={"24px"} sx={{background:"#9fa4c4", padding:"2%"}}>*/}
                            {/*    Список товарів*/}
                            {/*</Typography>*/}
                            <Box display={"flex"} flexWrap={"wrap"}>
                                {filterItems().length > 0 ? filterItems().map(c => (
                                    <Card sx={{width: "25%", margin: "1%"}}>
                                        <CardHeader
                                            title={c.name}
                                            subheader={c.category}
                                        />
                                        <CardContent>
                                            <Typography variant="body2" color="text.secondary">
                                                {c.description.length > 0 ? c.description : "Немає опису"}
                                            </Typography>
                                        </CardContent>
                                        <CardActions disableSpacing sx={{justifyContent: "space-between"}}>
                                            <Tooltip title={"Додати у кошик"}>
                                                <IconButton sx={{"& path":{fill:"white"}}} onClick={e => addToCart(c.id)}
                                                            aria-label="Додати у корзину">
                                                    <AddShoppingCartIcon/>
                                                </IconButton>
                                            </Tooltip>
                                            <Typography>
                                                {c.price}грн
                                            </Typography>
                                        </CardActions>
                                    </Card>
                                )) : <Typography fontSize={"32px"} width={"100%"} color={"black"} align={"center"}>Нічого
                                    не
                                    знайдено!</Typography>}
                            </Box>
                        </Box>
                        <Box width={"25%"} sx={{
                            backgroundColor: "#9fa4c4",
                            backgroundImage: "linear-gradient(315deg, #9fa4c4 0%, #9e768f 74%)",
                            padding: "2%"
                        }}>
                            <Typography fontSize={"20px"} sx={{marginBottom: "20px"}}>
                                Сортувати за фільтрами
                            </Typography>
                            <FormControl fullWidth sx={{marginBottom: "40px"}}>
                                <InputLabel id="demo-simple-select-label">Категорія товару"</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={category}
                                    label="Категорія товару"
                                    onChange={handleChangeCategory}
                                >
                                    {categories.map((f, i) => (
                                        <MenuItem key={i} value={f}>{f}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box>
                                <Typography id="input-slider" gutterBottom>
                                    Ціна (грн)
                                </Typography>
                                <Slider
                                    sx={{marginBottom: "40px"}}
                                    getAriaLabel={() => 'Ціна'}
                                    valueLabelDisplay={"auto"}
                                    value={priceRange}
                                    onChange={(e, n) => setPriceRange(n as number[])}
                                    min={1}
                                    max={100000}
                                    disableSwap
                                    marks={[
                                        {
                                            value: 1,
                                            label: "1"
                                        },
                                        {
                                            value: 100000,
                                            label: "100000"
                                        },
                                    ]}
                                />
                            </Box>
                        </Box>
                    </Box>
                }
            </ThemeProvider>
        </Box>
    );
};

export default Catalog;