import React, { Component } from 'react';

import Form from '../../primitives/Form';
import FormField from '../../primitives/FormField';

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

    // TODO: front end validation
    handleSubmit = async e => {
        e.preventDefault();

        const { form } = this.state;
        const username = form.username.trim();
        const { password } = form;

        // send form to server and receive back either error or token
        try {
            const response = await fetch('http://localhost:3001/api/auth/basic/login', {
                method: 'POST',
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const { token } = await response.json();
                this.props.login({ token });
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
        const { username, password } = form;
        const { handleChange, handleSubmit } = this;

        return (
            <>
                <h1>Log In</h1>
                <Form onSubmit={ handleSubmit }>
                    <FormField><label>Username<input value={ username } onChange={ e => handleChange('username', e) } /></label></FormField>
                    <FormField><label>Password<input type='password' value={ password } onChange={ e => handleChange('password', e) } /></label></FormField>                    
                    <input type='submit' />
                </Form>
            </>
            
        );
    }
}

export default BasicLogin;