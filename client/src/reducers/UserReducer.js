import {UPDATE_USER_INFO} from '../actions/type'
const UserReducer = (state,action) => {
    switch (action.type) {
        case UPDATE_USER_INFO :
            return {...state,info: {...action.payload}}
        default:
            return state;
    }
}
export default UserReducer