import React, { Component } from 'react';

import Form from '../../primitives/Form';
import FormField from '../../primitives/FormField';

class SignUpForm extends Component {
    constructor () {
        super();

        this.state = {
            form: {
                name: '',
                email: '',
                username: '',
                password: '',
                passwordConfirmation: ''
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

    // TODO: front end validation
    // validate and submit
    handleSubmit = async e => {
        e.preventDefault();

        const { form } = this.state;

        const { password, passwordConfirmation } = form;

        if (password !== passwordConfirmation) {
            return console.log(`passwords don't match`);
        }

        const name = form.name.trim();
        const email = form.email.trim();
        const username = form.username.trim();

        if ([name, email, username].some(attr => attr.length === 0)) {
            return console.log('no empty fields!');
        }

        console.log('submitting:', { name, email, username, password, passwordConfirmation });

        try {
            const response = await fetch('http://localhost:3001/api/auth/basic/signup', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ name, email, username, password, passwordConfirmation })
            });

            if (response.ok) {
                const { token } = await response.json();
                this.props.login(token);
            } else {
                const { error } = await response.json();
                console.log({ error });
            }

        } catch (error) {
            console.log({ error });
        }
    }

    render () {
        const { form } = this.state;
        const { name, email, username, password, passwordConfirmation } = form;
        const { handleChange, handleSubmit } = this;
        return (
            <>
                <h1>Sign Up</h1>
                <Form onSubmit={ handleSubmit }>
                    <FormField><label>Name<input type='text' value={ name } onChange={ e => handleChange('name', e) } /></label></FormField>
                    <FormField><label>Email<input type='email' value={ email } onChange={ e => handleChange('email', e) } /></label></FormField>
                    <FormField><label>Username<input type='text' value={ username } onChange={ e => handleChange('username', e) } /></label></FormField>
                    <FormField><label>Password<input type='password' value={ password } onChange={ e => handleChange('password', e) } /></label></FormField>
                    <FormField><label>Confirm Password<input type='password' value={ passwordConfirmation } onChange={ e => handleChange('passwordConfirmation', e) } /></label></FormField>
                    <input type='Submit' />
                </Form>
            </> 
        );
    }
}

export default SignUpForm;