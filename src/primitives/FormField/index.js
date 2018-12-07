import React from 'react';

import './FormField.sass';

const FormField = ({ children, ...rest }) => (
    <div className='FormField' { ...rest }>{ children }</div>
);

export default FormField;