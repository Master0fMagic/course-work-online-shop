import React, {Suspense, lazy} from "react";
import {Navigate} from "react-router-dom";
import {CircularProgress} from "@mui/material";

const Loader = (Component) => (props) =>
    (
        <Suspense fallback={<CircularProgress/>}>
            <Component {...props} />
        </Suspense>
    );

const Authorization = Loader(lazy(() => import('./pages/Auth/Authorization')))
const Registration = Loader(lazy(() => import('./pages/Register/Registration')))
const Layout = Loader(lazy(() => import('./layouts/MainLayout/Index')))
const Catalog = Loader(lazy(() => import('./pages/About/Catalog')))
const Orders = Loader(lazy(() => import('./pages/Orders/Orders')))

export const PATH = {
    AUTHORIZATION: "/auth",
    REGISTER: "/register",
    ABOUT: "/main/testdrives",
    PRODUCTS: "/main/catalog",
    ORDERS: "/main/orders",
}

const routes = [
    [
        {
            path: "main",
            element: <Navigate to={"/main/catalog"}/>
        },
        {
            path: "main",
            element: <Layout/>,
            children:[
                {
                    path: "catalog",
                    element: <Catalog/>
                },
                {
                    path: "orders",
                    element: <Orders/>
                },
            ]
        },
        {
            path: "*",
            element: <Navigate to={"/main/catalog"}/>
        },
        {
            path: "auth",
            element: <Authorization/>
        },
        {
            path: "register",
            element: <Registration/>
        },
    ],
    [
        {
            path: "main",
            element: <Navigate to={"/main/catalog"}/>
        },
        {
            path: "main",
            element: <Layout/>,
            children:[
                {
                    path: "catalog",
                    element: <Catalog/>
                },
                {
                    path: "orders",
                    element: <Orders/>
                },
            ]
        },
        {
            path: "*",
            element: <Navigate to={"/main/catalog"}/>
        },
    ]


]

export default routes;
