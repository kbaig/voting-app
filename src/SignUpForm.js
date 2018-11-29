import React, { Component } from 'react';

class SignUpForm extends Component {
    constructor () {
        super();

        this.state = {
            form: {
                name: '',
                email: '',
                username: '',
                password: '',
                confirm_password: ''
            }
        };
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

    // validate and submit
    handleSubmit = async e => {
        e.preventDefault();

        const { form } = this.state;

        const { password, confirm_password } = form;

        if (password !== confirm_password) {
            return console.log(`passwords don't match`);
        }

        const name = form.name.trim();
        const email = form.email.trim();
        const username = form.username.trim();

        if ([name, email, username].some(attr => attr.length === 0)) {
            return console.log('no empty fields!');
        }

        console.log('submitting: ', { name, email, username, password, confirm_password });

        // send form to server and receive back either form parsing error or token
        try {
            const response = await fetch('http://localhost:3001/api/auth/signup', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ name, email, username, password, confirm_password })
            });
            const responseData = await response.json();
            const { error, token } = responseData;

            if (error) {
                console.log('sign up form error:', error)
            } else {
                this.props.login(token);
            }

        } catch (error) {
            console.log(error);
        }
    }

    render () {
        const { form } = this.state;
        const { name, email, username, password, confirm_password } = form;
        const { handleChange, handleSubmit } = this;
        return ( 
            <form onSubmit={ handleSubmit }>
                Sign Up
                <label>Name <input type='text' value={ name } onChange={ e => handleChange('name', e) } /></label>
                <label>Email <input type='email' value={ email } onChange={ e => handleChange('email', e) } /></label>
                <label>Username <input type='text' value={ username } onChange={ e => handleChange('username', e) } /></label>
                <label>Password <input type='password' value={ password } onChange={ e => handleChange('password', e) } /></label>
                <label>Confirm Password <input type='password' value={ confirm_password } onChange={ e => handleChange('confirm_password', e) } /></label>
                <input type='Submit' />
            </form>
        );
    }
}

export default SignUpForm;