import React from 'react';

import './AuthForm.sass';

const AuthForm = ({ children, ...rest }) => (
    <form className='AuthForm' { ...rest }>{ children }</form>
);

export default AuthForm;