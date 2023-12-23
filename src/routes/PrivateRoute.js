import React, {useContext, useEffect, useState} from 'react';
import {Outlet, Navigate} from 'react-router-dom';

import AuthContext from '../auth/AuthContext.js';

/**
 *  If logged in, allow the user to see all private routes
 */
function PrivateRoute() {
    const [isAuthenticated] = useContext(AuthContext);
    const [componentMounted, setComponentMounted] = useState(false);

    // When App refreshes, it waits for user authentication
    useEffect(() => {
        setComponentMounted(true);
    }, []);

    if (!componentMounted) return;

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    //return a route using the parameters passed in the function
    return <Outlet />;
}

export default PrivateRoute;
