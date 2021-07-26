import UserApi from "../api/userApi";
import {NEW_FRIEND_LIST,GET_FRIEND_LIST, GET_FRIEND_REQUEST, NEW_FRIEND_REQUEST, UPDATE_FRIEND_REQUEST, UPDATE_USER_INFO,USER_LOGIN_SUCCESS,USER_LOGOUT } from "./type";

export const getUserInfo = (token) => async (dispatch) => {
    try {
        const res = await UserApi.getInfo(token)
        if(res.status === 200) {
            dispatch(userLoginSuccess())
            dispatch(updateUserInfo(res.data))
        }
    } catch (error) {
        dispatch(userLogout())
    }
}
export const getFriendRequest = () => async (dispatch) => {
    try {
        const res = await UserApi.getFriendRequests();
        if (res.status === 200) {
            dispatch({type : GET_FRIEND_REQUEST,payload : res.data})
        }
    } catch (error) {
        console.log(error)
    }
}
export const getFriendList = () => async (dispatch) => {
    try {
        const res = await UserApi.getFriendList()
        if(res.status === 200)
            dispatch({type : GET_FRIEND_LIST,payload : res.data})
    } catch (error) {
        console.log(error)
    }
}
export const updateNewFriend = (data) => ({
    type : NEW_FRIEND_LIST,
    payload : data
})
export const updateNewFriendRequest = (info) => ({
    type : NEW_FRIEND_REQUEST,
    payload : info
})
export const updateFriendRequest = (data) => ({
    type : UPDATE_FRIEND_REQUEST,
    payload : data
})
export const updateUserInfo = (info) => ({
    type : UPDATE_USER_INFO,
    payload : info
})
export const userLogout = () => ({
    type : USER_LOGOUT,
})
export const userLoginSuccess = () => ({
    type : USER_LOGIN_SUCCESS,
})