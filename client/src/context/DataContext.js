import React, { createContext, useContext, useEffect, useState } from 'react';
import UserContext from './UserContext';
const DataContext = createContext();
export const useData = () => useContext(DataContext);
export const DataProvider = ({ children }) => {
    const [token,setToken] = useState(null)
    useEffect(() => {
        const getToken = () => {
            const token = localStorage.getItem('token')
            setToken(token)
        }
        getToken()
    },[])
    return (
        <DataContext.Provider value={{ user: UserContext(token),token : {token,setToken}}}>
            {children}
        </DataContext.Provider>
    );
};
