import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthApi from '../api/authApi';
import UserContext from './UserContext';
const DataContext = createContext();
export const useData = () => useContext(DataContext);
export const DataProvider = ({ children }) => {
    const [token,setToken] = useState(localStorage.getItem('token'))
    useEffect(() => {
        AuthApi.setHeaderAxios(token)
    },[token])
    return (
        <DataContext.Provider value={{ user: UserContext(token),token : [token,setToken]}}>
            {children}
        </DataContext.Provider>
    );
};
