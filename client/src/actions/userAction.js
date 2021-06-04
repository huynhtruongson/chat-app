import {UPDATE_USER_INFO } from "./type";

export const updateUserInfo = (info) => ({
    type : UPDATE_USER_INFO,
    payload : info
})