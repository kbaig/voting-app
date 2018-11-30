import React, { Component } from 'react';

class BasicLogin extends Component {
    constructor () {
        super();

        this.state = {
            form: {
                username: '',
                password: ''
            }
        }
    }

    handleChange = (attr, e) => {
        const { value } = e.target;
        this.setState(prevState => {

            const prevForm = prevState.form;
            
            return {
                ...prevState,
                form: {
                    ...prevForm,
                    [attr]: value
                }
            };
        });
    }

    handleSubmit = async e => {
        e.preventDefault();

        const { form } = this.state;
        const username = form.username.trim();
        const { password } = form;

        // send form to server and receive back either error or token
        try {
            const response = await fetch('http://localhost:3001/api/auth/basic/login', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const responseData = await response.json();
            const { error, token } = responseData;

            if (error) {
                console.log('login form error:', error)
            } else {
                this.props.login(token);
            }

        } catch (error) {
            console.log(error);
        }
    }

    render () {
        const { form } = this.state;
        const { username, password } = form;
        const { handleChange, handleSubmit } = this;

        return (
            <form onSubmit={ handleSubmit }>
                <label>Username: <input value={ username } onChange={ e => handleChange('username', e) } /></label>
                <label>Password: <input type='password' value={ password } onChange={ e => handleChange('password', e) } /></label>
                <input type='submit' />
            </form>
        );
    }
}

export default BasicLogin;