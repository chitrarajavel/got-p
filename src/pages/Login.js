import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import '../styles/Login.css';
import 'bootstrap/dist/css/bootstrap.css';

/**
 * Login Page gets login function props from App.js and logs in and navigates to the Front Page
 */
const Login = ({login}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);

    let navigate = useNavigate();

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handlePWChange(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        let response = login(email, password);

        if (response.success) {
            navigate('/');
        } else {
            setShowError(true);
        }
    }

    return (
        <div className="Login-Wrapper">
            <div className="left-container"></div>
            <div className="center-container">
                <div className="card-style Login rounded">
                    <h6 className="mb-3" style={{textAlign: 'center'}}>
                        Login to View Fan-Page
                    </h6>
                    <form onSubmit={handleSubmit}>
                        <div className="Login-Form-Group mb-2">
                            <label htmlFor="email" className="form-label">
                                Email Address:
                            </label>
                            <input
                                name="email"
                                id="email"
                                type="email"
                                className="form-control Login-Form-Input"
                                onChange={handleEmailChange}
                            ></input>
                        </div>
                        <div className="Login-Form-Group mb-4">
                            <label htmlFor="password" className="form-label">
                                Password:
                            </label>
                            <input
                                name="password"
                                id="password"
                                type="password"
                                className="form-control Login-Form-Input"
                                onChange={handlePWChange}
                            ></input>
                        </div>
                        <button
                            name="submit"
                            type="submit"
                            className="btn btn-dark block w-100 mt-2"
                        >
                            Submit
                        </button>
                    </form>
                    {showError ? (
                        <div className="error-msg">
                            Invalid Email or Password
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="right-container"></div>
        </div>
    );
};
export default Login;
