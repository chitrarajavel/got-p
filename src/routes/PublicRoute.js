import React, {useContext} from 'react';
import {Outlet, Navigate} from 'react-router-dom';

import AuthContext from '../auth/AuthContext.js';

/**
 *  If not logged in, allow the user to see login and signup
 */
function PublicRoute() {
    const [isAuthenticated] = useContext(AuthContext);

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    //return a route using the parameters passed in the function
    return <Outlet />;
}

export default PublicRoute;
