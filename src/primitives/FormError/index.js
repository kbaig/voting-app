import React from 'react';

import './FormError.sass';

const FormError = ({ error, children }) => (
    <div className='FormError'>{ children }</div>
);

export default FormError;