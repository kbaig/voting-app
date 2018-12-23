import React from 'react';

import './InputButton.sass';

const InputButton = ({ children, ...rest }) => (
    <button type='button' className='InputButton' { ...rest } >{ children }</button>
);

export default InputButton;