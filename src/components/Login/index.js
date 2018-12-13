import React from 'react';

import BasicLogin from './BasicLogin';
import GitHubLogin from '../GitHubLogin';

const Login = ({ login, flashError }) => (
    <>
        <BasicLogin login={ login } flashError={ flashError } />
        <GitHubLogin login={ login } />
    </>
);

export default Login;
