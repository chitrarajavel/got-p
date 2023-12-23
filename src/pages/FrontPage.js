import React, {useContext} from 'react';

import AuthContext from '../auth/AuthContext.js';

import '../styles/FrontPage.css';

/**
 * Loads Front Page and it's contents based on whether the user is logged in
 */
const FrontPage = () => {
    let [isAuthenticated, currentUser] = useContext(AuthContext);

    let frontPageMsg = !isAuthenticated
        ? `Login to continue!!!`
        : `Welcome ${currentUser.firstName}!!!`;

    return (
        <div className="FrontPage">
            <h1>Game of Thrones Fan Page</h1>
            <h3>{frontPageMsg}</h3>
            <div className="FrontPage-Links"></div>
        </div>
    );
};
export default FrontPage;
