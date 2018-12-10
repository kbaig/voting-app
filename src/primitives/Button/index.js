import React from 'react';

import './Button.sass';

const Button = ({ children, ...rest }) => (
    <input className='Button' { ...rest } />
);

export default Button;