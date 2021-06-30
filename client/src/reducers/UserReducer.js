import {UPDATE_USER_INFO, USER_LOGIN_SUCCESS, USER_LOGOUT} from '../actions/type'
const initialState = {
    isLogged : false,
    info : {}
}
const UserReducer = (state = initialState,action) => {
    switch (action.type) {
        case USER_LOGIN_SUCCESS :
                return {...state,isLogged : true}
        case UPDATE_USER_INFO :
            return {...state,info:action.payload}
        case USER_LOGOUT :
                return {...state,isLogged : false}
        default:
            return state;
    }
}
export default UserReducer