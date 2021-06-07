import React from 'react'
import { Redirect, Route } from 'react-router'
import { useData } from '../../context/DataContext'

const AuthRoute = ({children,...props}) => {
    const {user : [{isLogged}]} = useData()
    return (
        <Route 
            {...props} 
            render={() => isLogged ? <Redirect to='/'/> : children} 
        />
    )
}

export default AuthRoute
