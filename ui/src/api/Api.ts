import axios, {AxiosResponse} from "axios";

const baseURL = "http://localhost:5000/api/";

const instance = axios.create({
    withCredentials: true,
    headers: {'Content-Type': 'application/json'}
})

instance.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export type Response = {
    data: any,
    message?: string
}

export type GetOrder = {
    created_time: number,
    id: number,
    is_delivered: boolean,
    place: string,
    sum: number
}

export type PostItem = {
    product_id: number,
    amount: number
}

export type PostOrder = {
    address: string,
    delivery_service_id: number,
    items: PostItem[]
}

export type GetDeliviries = {
    id: number,
    name: string,
    price: number
}

export type PostLogin = {
    login: string,
    password: string
}

export type Register = {
    email: string | null,
    password: string
    repeated_password: string,
    phone: string,
    first_name: string,
    last_name: string
}

export type GetProducts = {
    category: string,
    category_id: number,
    description: string,
    id: number,
    name: string,
    price: number
}

export type GetHistory = {
    address: string,
    date: number,
    delivery_price: number,
    delivery_service: string,
    discount: number,
    sum: number,
    sum_with_discount: number,
    total_sum: number
    id: number,
}

const products = "products";
const menu = "order/menu/";
const login = "login";
const register = "sing-up";
const logout = "logout";
const history = "order/history";
const createOrder = "order/create";
const dealerCenter = "delivery-services"

instance.defaults.baseURL = baseURL;

export class Api {
    login = async (acc: PostLogin): Promise<Response> => {
        try {
            const result: AxiosResponse = await instance.post(login, acc);
            return {data: result};
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
    register = async (acc: Register): Promise<Response> => {
        try {
            return await instance.post(register, acc).then(res => {
                return {data: res.data};
            }).catch(err => {
                return {data: null, message: err}
            });
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
    logout = async (): Promise<Response> => {
        try {
            const result: AxiosResponse = await instance.get(logout);
            return {data: result};
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
    getProducts = async (): Promise<Response> => {
        try {
            return await instance.get(products).then(res => {
                return {data: res.data};
            }).catch(err => {
                return {data: null, message: err}
            });
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
    getDealersCenter = async (): Promise<Response> => {
        try {
            return await instance.get(dealerCenter).then(res => {
                return {data: res.data};
            }).catch(err => {
                return {data: null, message: err}
            });
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
    getHistory = async (): Promise<Response> => {
        try {
            return await instance.get(history).then(res => {
                return {data: res.data};
            }).catch(err => {
                return {data: null, message: err}
            });
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
    createOrder = async (order: PostOrder): Promise<Response> => {
        try {
            return await instance.post(createOrder, order).then(res => {
                return {data: res.data};
            }).catch(err => {
                return {data: null, message: err}
            });
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
    getDescOrder = async (id: number): Promise<Response> => {
        try {
            return await instance.get(history + "/" + id).then(res => {
                return {data: res.data};
            }).catch(err => {
                return {data: null, message: err}
            });
        } catch (err) {
            console.log(err)
            return {data: null, message: err.message};
        }
    }
}