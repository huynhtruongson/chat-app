import UserApi from "../api/userApi";
import {UPDATE_USER_INFO,USER_LOGIN_SUCCESS,USER_LOGOUT } from "./type";

export const getUserInfo = (token) => async (dispatch) => {
    try {
        const res = await UserApi.getInfo(token)
        if(res.status === 200) {
            dispatch(updateUserInfo(res.data))
        }
    } catch (error) {
        dispatch(userLogout())
    }
}
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