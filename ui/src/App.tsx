import React from 'react';
import './App.css';
import {Box} from "@mui/material";
import {SelectUserAuth} from "./redux/store/user/selector";
import {useDispatch, useSelector} from "react-redux";
import {login, setAuth, setUser} from "./redux/store/user/slice";
import {useRoutes} from "react-router";
import routes from "./routes";

function App() {
  const auth = useSelector(SelectUserAuth);
  const dispatch = useDispatch();
  if(localStorage.getItem('techShop') && !auth)
  {
    const item = JSON.parse(localStorage.getItem('techShop'));
    dispatch(login({login: item.login, password: item.password}));
  }

  const content = useRoutes(routes[!auth ? 0 : 1]);

  return (
      <Box>
        {content}
      </Box>
  );
}

export default App;
