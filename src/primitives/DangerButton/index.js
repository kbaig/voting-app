import React from 'react';

import './DangerButton.sass';

const DangerButton = ({ children, ...rest }) => (
    <button className='Button DangerButton' { ...rest }>{ children }</button>
);

export default DangerButton;