import {useEffect, useState} from 'react';

/**
 * This hook is being used for a client side storage for a token to store temporary logged in user information
 */
// Reference: SB jobly project solution
export default function useObjStorage(key, initValue = null) {
    const initialValue = JSON.parse(localStorage.getItem(key)) || initValue;
    const [state, setState] = useState(initialValue);
    useEffect(() => {
        if (state === null) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(state));
        }
    }, [key, state]);
    return [state, setState];
}
