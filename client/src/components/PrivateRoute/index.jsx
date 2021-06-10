import React from 'react'
import { Redirect, Route } from 'react-router'
import { useData } from '../../context/DataContext'

const PrivateRoute = ({children,...props}) => {
    const {user : [{isLogged}]} = useData()
    return (
        <Route 
            {...props} 
            render={() => isLogged ? children :  <Redirect to='/login'/>} 
        />
    )
}

export default PrivateRoute
