import React from 'react';

import './NeutralButton.sass';

const NeutralButton = ({ children, ...rest }) => (
    <button className='Button NeutralButton' { ...rest }>{ children }</button>
);

export default NeutralButton;