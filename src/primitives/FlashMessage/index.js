import React from 'react';
import { createPortal } from 'react-dom';

import './FlashMessage.sass';

const body = document.body;

const FlashMessage = ({ show, children }) => (
    show && createPortal(
        <div className='FlashMessage'>{ children }</div>,
        body
    )
);

export default FlashMessage;