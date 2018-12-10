import React, { Component } from 'react';

import BasicLogin from './BasicLogin';
import GitHubLogin from '../GitHubLogin';

class Login extends Component {
    render () {
        const { login } = this.props;

        return ( 
            <>
                <BasicLogin login={ login } />
                <GitHubLogin login={ login } />
            </>
        );
    }
}

export default Login;
