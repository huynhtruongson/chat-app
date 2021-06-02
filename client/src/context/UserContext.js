import { useEffect, useReducer } from 'react'
import UserReducer from '../reducers/UserReducer'

const UserContext = () => {
    const initialState = {
        isLogged : false,
        infor : {}
    }
    const [state,dispath] = useReducer(UserReducer,initialState)
    useEffect(() => {
        dispath({type : 'UPDATE_USER_INFOR',payload : {
            firstname : 'Sơn',
            lastname : 'Huỳnh'
        }})
    },[])
    return [state,dispath]
}

export default UserContext
