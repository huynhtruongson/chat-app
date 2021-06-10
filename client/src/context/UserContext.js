import { useEffect, useReducer } from 'react'
import { updateUserInfo,userLogout,userLogin } from '../actions/userAction'
import UserReducer from '../reducers/UserReducer'
import UserApi from '../api/userApi'
const UserContext = (token) => {
    const initialState = {
        isLogged : !!token,
        info : {}
    }
    const [state,dispath] = useReducer(UserReducer,initialState)
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                if(token) {
                    const res = await UserApi.getInfo(token)
                    if(res.status === 200) {
                        dispath(userLogin())
                        dispath(updateUserInfo(res.data))
                    }
                }
            } catch (error) {
                const {status} = error.response
                if(status === 400) {
                    dispath(userLogout())
                }
            }
        }
        fetchUserInfo()
    },[token])
    return [state,dispath]
}

export default UserContext
