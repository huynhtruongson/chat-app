import {UPDATE_USER_INFO,USER_LOGIN,USER_LOGOUT } from "./type";

export const updateUserInfo = (info) => ({
    type : UPDATE_USER_INFO,
    payload : info
})
export const userLogout = () => ({
    type : USER_LOGOUT,
})
export const userLogin = () => ({
    type : USER_LOGIN,
})