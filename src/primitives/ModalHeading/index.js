import React from 'react';

import './ModalHeading.sass';

const ModalHeading = ({ children, ...rest }) => (
    <h1 className='ModalHeading' { ...rest }>{ children }</h1>
);

export default ModalHeading;