import { ADD_USER_ONLINE, ONLINE_USER, REMOVE_USER_ONLINE } from "./type";

export const getUserOnline = (users) => ({
    type : ONLINE_USER,
    payload : users
})
export const addUserOnline = (userId) => ({
    type : ADD_USER_ONLINE,
    payload : userId
})
export const removeUserOnline = (userId) => ({
    type : REMOVE_USER_ONLINE,
    payload : userId
})
