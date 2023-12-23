import {useEffect, useState} from 'react';

import RouteList from './routes/RouteList.js';
import AuthContext from './auth/AuthContext.js';
import GOTContext from './auth/GOTContext.js';
import Api from './modules/Api.js';
import useObjStorage from './hooks/useObjStorage.js';
import useGOTApi from './hooks/useGOTApi.js';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const USER_KEY = 'CUR_USER';
const BASE_URL = 'https://anapioficeandfire.com/api';

function App() {
    // Set up initial states
    const [currentUser, setCurrentUser] = useObjStorage(USER_KEY, null); // TODO: May change to token based authorization
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [booksArray, booksLoaded] = useGOTApi(`${BASE_URL}/books`);
    const [charactersArray, charactersLoaded] = useGOTApi(
        `${BASE_URL}/characters`
    );

    const api = new Api();

    // On load, logs in user if the current user token exists in local storage
    useEffect(() => {
        if (currentUser) {
            login(currentUser.email, currentUser.password);
        }
    }, []);

    /**
     * Sign up function to register user via Api module
     */
    function signup(formData) {
        let response = api.registerUser(formData);

        if (response.success) {
            let newUserData = api.getUser(formData.email, formData.password);
            setCurrentUser(newUserData);
            setIsAuthenticated(true);
        }
    }

    /**
     * Login function to get user via Api module
     */
    function login(email, password) {
        // get userObj from the API
        let userObj = api.getUser(email, password);
        if (!userObj) return {success: false};

        setCurrentUser(userObj);
        setIsAuthenticated(true);
        return {success: true};
    }

    /**
     * Logout function to reset currentUser
     */
    function logout() {
        setCurrentUser(null);
        setIsAuthenticated(false);
    }

    return (
        <div className="App">
            <AuthContext.Provider value={[isAuthenticated, currentUser]}>
                <GOTContext.Provider
                    value={{
                        booksArray: booksArray,
                        booksLoaded: booksLoaded,
                        charactersArray: charactersArray,
                        charactersLoaded: charactersLoaded,
                    }}
                >
                    <RouteList login={login} signup={signup} logout={logout} />
                </GOTContext.Provider>
            </AuthContext.Provider>
        </div>
    );
}
export default App;
