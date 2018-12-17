import React from 'react';
import { createPortal } from 'react-dom';

import './Modal.sass';

const Modal = ({ cancel, children }) => (
    createPortal(
        <>
            <div className='ModalBackdrop' onClick={ cancel }></div>
            <div className='Modal'>{ children }</div>
        </>,
        document.body
    )
);

export default Modal;