import React from 'react';

import './Button.sass';

const Button = ({ children, ...rest }) => (
    <button className='Button' { ...rest } >{ children }</button>
);

export default Button;