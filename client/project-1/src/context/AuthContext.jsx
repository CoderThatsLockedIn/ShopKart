import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../axios/axios.js'
const AuthContext = createContext()
export const AuthProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);
    const [loader, setLoader] = useState(true);
    useEffect(() => {
        axiosInstance.get('/customer/me').then((response) => {
            const customerData = response.data.customer || response.data.data || response.data;
            setCustomer(customerData)
        }).catch((err) => {
            console.log(err);
            setCustomer(null)
        }).finally(() => {
            setLoader(false)
        })

    }, [])

    const logout = async () => {
        try {
            await axiosInstance.post('/customer/logout')
        }
        catch(err) {
            console.error('Logout error: ',err);
        }
        finally {
            setCustomer(null);
        }
    }

    return (<AuthContext.Provider value={{ customer, setCustomer, loader, setLoader, logout }}>
        {children}
        </AuthContext.Provider>);
}
export const useAuth = () => useContext(AuthContext);