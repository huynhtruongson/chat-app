import React, { createContext, useContext } from 'react';
import UserContext from './UserContext';
const DataContext = createContext();
export const useData = () => useContext(DataContext);
export const DataProvider = ({ children }) => {
    return (
        <DataContext.Provider value={{ user: UserContext()}}>
            {children}
        </DataContext.Provider>
    );
};
