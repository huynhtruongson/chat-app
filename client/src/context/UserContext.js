import { useEffect, useReducer } from 'react'
import { updateUserInfo } from '../actions/userAction'
import UserReducer from '../reducers/UserReducer'

const UserContext = () => {
    const initialState = {
        isLogged : false,
        info : {}
    }
    const [state,dispath] = useReducer(UserReducer,initialState)
    useEffect(() => {
        dispath(updateUserInfo({firstname : 'Sơn',lastname : 'Huỳnh'}))
    },[])
    return [state,dispath]
}

export default UserContext
