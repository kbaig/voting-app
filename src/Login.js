import React, { Component } from 'react';

class Login extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.login();
    }

    render () {
        return (
            !this.props.isAuthenticated && 
                <form onSubmit={ this.handleSubmit }>
                    <input type='submit' value='Login'/>
                </form>
        );
    }
}

export default Login;
