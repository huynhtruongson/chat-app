import {UPDATE_USER_INFO, USER_LOGIN, USER_LOGOUT} from '../actions/type'
const UserReducer = (state,action) => {
    switch (action.type) {
        case USER_LOGIN :
                return {...state,isLogged : true}
        case UPDATE_USER_INFO :
            return {...state,info: {...action.payload}}
        case USER_LOGOUT :
                return {...state,isLogged : false}
        default:
            return state;
    }
}
export default UserReducer