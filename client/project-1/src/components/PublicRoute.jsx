import React from 'react'
import {useAuth} from '../context/AuthContext.jsx'
import {Navigate} from 'react-router-dom'
function PublicRoute({children}) {
    const {customer, loader} = useAuth();
    if (loader) {
        return <h1>Loading...</h1>
    }
    if (customer) {
        return <Navigate to="/home" replace/>
    }
    return children
}

export default PublicRoute;