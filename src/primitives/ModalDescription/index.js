import React from 'react';

import './ModalDescription.sass';

const ModalDescription = ({ children, ...rest }) => (
    <p className='ModalDescription' { ...rest }>{ children }</p>
);

export default ModalDescription;