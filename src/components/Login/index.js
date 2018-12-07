import React, { Component } from 'react';

import BasicLogin from './BasicLogin';
import GitHubLogin from './GitHubLogin';

import FormField from '../../primitives/FormField';

class Login extends Component {
    render () {
        const { login } = this.props;

        return ( 
            <div>
                <FormField>
                    <BasicLogin login={ login } />
                </FormField>
                <GitHubLogin login={ login } />
            </div>
        );
    }
}

export default Login;
