import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router'

const PrivateRoute = ({children,...props}) => {
    const {isLogged} = useSelector(state => state.user)
    return (
        <Route 
            {...props} 
            render={() => isLogged ? children :  <Redirect to='/login'/>} 
        />
    )
}

export default PrivateRoute
