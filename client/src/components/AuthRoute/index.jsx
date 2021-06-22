import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router'

const AuthRoute = ({children,...props}) => {
    const {isLogged} = useSelector(state => state.user)
    return (
        <Route 
            {...props} 
            render={() => isLogged ? <Redirect to='/'/> : children} 
        />
    )
}

export default AuthRoute
