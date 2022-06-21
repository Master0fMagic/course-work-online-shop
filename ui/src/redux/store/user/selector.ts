import { createSelector } from '@reduxjs/toolkit';
import { RootState } from "../configureStore";
import { UserState } from './slice';

export const selectDomain = (state: RootState) => {
    return state.user;
};

export const SelectUser = createSelector(
    [selectDomain],
    (user) => user.account,
);

export const SelectUserError = createSelector(
    [selectDomain],
    (user) => user.errorMsg,
);

export const SelectUserItems = createSelector(
    [selectDomain],
    (user) => user.items,
);

export const SelectUserAuth = createSelector(
    [selectDomain],
    (user) => user.isAuth,
);