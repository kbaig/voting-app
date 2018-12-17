import React from 'react';
import { createPortal } from 'react-dom';

import './FlashMessage.sass';

const FlashMessage = ({ show, children }) => (
    show && createPortal(
        <div className='FlashMessage'>{ children }</div>,
        document.body
    )
);

export default FlashMessage;