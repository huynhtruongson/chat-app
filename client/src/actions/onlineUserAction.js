import { ADD_USER_ONLINE, ONLINE_USER, REMOVE_ONLINE_USER } from "./type";

export const getUserOnline = (users) => ({
    type : ONLINE_USER,
    payload : users
})
export const addUserOnline = (userId) => ({
    type : ADD_USER_ONLINE,
    payload : userId
})
export const removeUserOnline = (userId) => ({
    type : REMOVE_ONLINE_USER,
    payload : userId
})
