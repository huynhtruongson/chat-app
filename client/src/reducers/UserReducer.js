import {GET_FRIEND_REQUEST, NEW_FRIEND_REQUEST, UPDATE_FRIEND_REQUEST, UPDATE_USER_INFO, USER_LOGIN_SUCCESS, USER_LOGOUT} from '../actions/type'
const initialState = {
    isLogged : !!localStorage.getItem('token'),
    info : {},
    friendRequest : []
}
const UserReducer = (state = initialState,action) => {
    switch (action.type) {
        case USER_LOGIN_SUCCESS :
            return {...state,isLogged : true}
        case UPDATE_USER_INFO :
            return {...state,info:action.payload}
        case USER_LOGOUT :
            return {...state,isLogged : false}
        case GET_FRIEND_REQUEST :
            return {...state,friendRequest : action.payload}
        case UPDATE_FRIEND_REQUEST :
            return {...state,friendRequest : action.payload}
        case NEW_FRIEND_REQUEST :
            const friendRequestList = [...state.friendRequest]
            friendRequestList.unshift(action.payload)
            return {...state,friendRequest : friendRequestList}
        default:
            return state;
    }
}
export default UserReducer