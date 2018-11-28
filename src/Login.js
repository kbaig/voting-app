import React, { Component } from 'react';

import GitHubLogin from './GitHubLogin';

class Login extends Component {

    // handleSubmit = e => {
    //     e.preventDefault();
    //     this.props.login();
    // }

    render () {
        return (
            !this.props.isAuthenticated && 
                <div>
                    {/* <form onSubmit={ this.handleSubmit }>
                        <input type='submit' value='Login'/>
                    </form> */}
                    <GitHubLogin login={ this.props.login } />
                </div>
        );
    }
}

export default Login;
