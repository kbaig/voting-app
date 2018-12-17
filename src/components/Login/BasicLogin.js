import React, { Component } from 'react';

import AuthForm from '../../primitives/AuthForm';
import FormHeading from '../../primitives/FormHeading';
import FormError from '../../primitives/FormError';
import FormInput from '../../primitives/FormInput';
import FormSubmitRow from '../../primitives/FormSubmitRow';
import Button from '../../primitives/Button';

class BasicLogin extends Component {
    constructor () {
        super();

        this.state = {
            form: {
                username: {
                    value: '',
                    error: null
                },
                password: {
                    value: '',
                    error: null
                }
            },
            formError: null
        }
    }

    handleChange = attr => e => {
        const { value } = e.target;

        this.setState(prevState => ({
            ...prevState,
            form: {
                ...prevState.form,
                [attr]: {
                    ...prevState.form[attr],
                    value,
                    error: null
                }
            }
        }));
    }

    handleSubmit = async e => {
        e.preventDefault();

        const { form } = this.state;
        const username = form.username.value.trim();
        const password = form.password.value;

        // send form to server and receive back either error or token
        try {
            const response = await fetch('http://localhost:3001/api/auth/basic/login', {
                method: 'POST',
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const { token } = await response.json();
                console.log({ token })
                this.props.login({ token });
            } else {
                const { error } = await response.json();
                console.log({ error });
                this.handleResponseError(response.status, error);
            }

        } catch (error) {
            this.props.flashError('Something went wrong. Please try again');
        }
    }

    handleResponseError = (status, error) => {
        if (status === 500) return this.props.flashError(error);
        if (status === 422) {
            if (typeof error === 'string') {
                this.setState({ formError: error });
            } else {
                this.setState(prevState => {
                    const { form } = prevState;
                    const attrs = Object.keys(form);

                    attrs.forEach(attr => {
                        form[attr].error = error[attr];
                    });

                    return { ...prevState, form };
                });
            }
        }
    }

    render () {
        const { handleChange, handleSubmit, state } = this;
        const { form, formError } = state;
        const { username, password } = form;
        
        return (
            <AuthForm onSubmit={ handleSubmit }>
                <FormHeading>Log In</FormHeading>
                
                { formError && <FormError>{ formError }</FormError> }

                <FormInput
                    label='Username'
                    placeholder='fprefect'
                    value={ username.value }
                    onChange={ handleChange('username') }
                    focus
                    withError
                    error={ username.error }
                    showError={ true }
                />
                <FormInput
                    type='password'
                    label='Password'
                    placeholder='SLaR!1bar!fAS~'
                    value={ password.value }
                    onChange={ handleChange('password') }
                    withError
                    error={ password.error }
                    showError={ true }
                />
                
                <FormSubmitRow>
                    <Button>Log In</Button>
                </FormSubmitRow>
            </AuthForm>
        );
    }
}

export default BasicLogin;