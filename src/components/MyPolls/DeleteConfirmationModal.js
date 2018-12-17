import React from 'react';

import Modal from '../../primitives/Modal';
import ModalHeading from '../../primitives/ModalHeading';
import ModalDescription from '../../primitives/ModalDescription'
import NeutralButton from '../../primitives/NeutralButton';
import DangerButton from '../../primitives/DangerButton';

const DeleteConfirmationModal = ({ cancelDeletion, confirmDeletion }) => (
    <Modal cancel={ cancelDeletion }>
        <ModalHeading>Are you sure?</ModalHeading>
        <ModalDescription>This will permanently delete your poll.</ModalDescription>
        <div className='ButtonRow'>
            <NeutralButton onClick={ cancelDeletion }>Cancel</NeutralButton>
            <DangerButton onClick={ confirmDeletion }>Delete</DangerButton>
        </div>
    </Modal>
);

export default DeleteConfirmationModal;