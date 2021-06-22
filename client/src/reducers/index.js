import {combineReducers} from 'redux'
import user from './UserReducer'
import message from './MessageReducer'
export default combineReducers({
    user,
    message,
})