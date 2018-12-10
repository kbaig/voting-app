import React from 'react';

import './Form.sass';

const Form = ({ children, ...rest }) => (
    <form className='Form' { ...rest }>{ children }</form>
);

export default Form;