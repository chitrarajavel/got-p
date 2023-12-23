import React from 'react';
import ReactDOM from 'react-dom/client';

import Signup from '../pages/Signup.js';

it('renders without crashing', () => {
    const div = document.createElement('div');
    const root = ReactDOM.createRoot(div);
    root.render(<Signup />);
});
