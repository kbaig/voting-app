import React from 'react';

import './Form.sass';

const Form = ({ children, ...rest }) => (
    <form { ...rest } className='Form'>{ children }</form>
);

export default Form;