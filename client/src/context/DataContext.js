import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthApi from '../api/authApi';
import MessageContext from './MessageContext';
import UserContext from './UserContext';
const DataContext = createContext();
export const useData = () => useContext(DataContext);
export const DataProvider = ({ children }) => {
    const [token,setToken] = useState(localStorage.getItem('token'))
    useEffect(() => {
        AuthApi.setHeaderAxios(token)
    },[token])
    return (
        <DataContext.Provider 
            value={{ 
                token : [token,setToken],
                user: UserContext(token),
                message : MessageContext()
            }}
        >
            {children}
        </DataContext.Provider>
    );
};
