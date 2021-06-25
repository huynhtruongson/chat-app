import {combineReducers} from 'redux'
import user from './UserReducer'
import message from './MessageReducer'
import { USER_LOGOUT } from '../actions/type'
const appReducer =  combineReducers({
    user,
    message,
})
const rootReducer = (state,action) => {
    if(action.type === USER_LOGOUT)
        return appReducer(undefined,action)
    return appReducer(state,action)
}
export default rootReducer
// function combined = (state,action) => ({
//     user : user(state.user,action),
//     message : user(state.message,action)
// })