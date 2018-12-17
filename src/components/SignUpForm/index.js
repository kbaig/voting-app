import React, { Component } from 'react';

import GitHubLogin from '../GitHubLogin';

import AuthForm from '../../primitives/AuthForm';
import FormHeading from '../../primitives/FormHeading';
import FormInput from '../../primitives/FormInput';
import FormSubmitRow from '../../primitives/FormSubmitRow';
import Button from '../../primitives/Button';

import validate from './validate';

// TODO: add email and username check on onfocus
class SignUpForm extends Component {
    constructor () {
        super();

        this.state = {
            form: {
                name: {
                    value: '',
                    error: null,
                    showError: false
                },
                email: {
                    value: '',
                    error: null,
                    showError: false
                },
                username: {
                    value: '',
                    error: null,
                    showError: false
                },
                password: {
                    value: '',
                    error: null,
                    showError: false
                },
                passwordConfirmation: {
                    value: '',
                    error: null,
                    showError: false
                }
            }
        };
    }

    // show user error only if they have finished typing
    revealErrorOnBlur = attr => e => {
        this.setState(prevState => ({
            ...prevState,
            form: {
                ...prevState.form,
                [attr]: {
                    ...prevState.form[attr],
                    showError: !!prevState.form[attr].error
                }
            }
        }));
    }

    // validate and change value
    handleChange = attr => e => {
        const { value } = e.target;

        this.setState(prevState => {
            const prevForm = prevState.form;

            const error = validate(attr, value, prevForm);

            // special error render handling for password confirmation
            // error will show on pw conf change if
            // showError is already true or conf length >= pw length
            const showError = attr === 'passwordConfirmation' && (prevForm[attr].showError || value.length >= prevForm.password.value.length);

            const form = {
                ...prevForm,
                [attr]: {
                    ...prevForm[attr],
                    value,
                    error,
                    showError
                }
            };

            // add password confirmation error if password just got modified and passsword conf field has been interacted with
            if (attr === 'password' && form.passwordConfirmation.value !== '') {
                const passwordConfirmationError = validate('passwordConfirmation', form.passwordConfirmation.value, form);

                form.passwordConfirmation = {
                    ...form.passwordConfirmation,
                    error: passwordConfirmationError,
                    showError: !!passwordConfirmationError
                }
            }

            return { ...prevState, form };
        });
    }

    // submit
    handleSubmit = async e => {
        e.preventDefault();

        const { form } = this.state;

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const username = form.username.value.trim();
        const password = form.password.value;
        const passwordConfirmation = form.passwordConfirmation.value;

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
                this.handleResponseError(response.status, error);
            }

        } catch (error) {
            this.props.flashError('Something went wrong. Please try again');
        }
    }

    handleResponseError = (status, error) => {
        if (status === 500) this.props.flashError(error);
        if (status === 422) {
            this.setState(prevState => {
                const { form } = prevState;
                const attrs = Object.keys(error);

                attrs.forEach(attr => {
                    form[attr] = {
                        ...form[attr],
                        error: error[attr],
                        showError: true
                    };
                });

                return { ...prevState, form };
            });
        }
    }

    render () {
        const { revealErrorOnBlur, handleChange, handleSubmit, state, props } = this;
        const { form } = state;
        const { name, email, username, password, passwordConfirmation } = form;
        const { login } = props;
        
        return (
            <>
                <AuthForm onSubmit={ handleSubmit }>
                    <FormHeading>Sign Up</FormHeading>
           
                    <FormInput
                        label='Name'
                        placeholder='Ford Prefect'
                        value={ name.value }
                        onChange={ handleChange('name') }
                        withError
                        error={ name.error }
                        showError={ name.showError }
                        onBlur={ revealErrorOnBlur('name') }
                        focus
                    />
                    <FormInput
                        type='email'
                        label='Email'
                        placeholder='ford@example.com'
                        value={ email.value }
                        onChange={ handleChange('email') }
                        withError
                        error={ email.error }
                        showError= { email.showError }
                        onBlur={ revealErrorOnBlur('email') }
                    />
                    <FormInput
                        label='Username'
                        hint='4 to 15 alphanumeric characters'
                        placeholder='fprefect'
                        value={ username.value }
                        onChange={ handleChange('username') }
                        withError
                        error={ username.error }
                        showError= { username.showError }
                        onBlur={ revealErrorOnBlur('username') }
                    />
                    <FormInput
                        type='password'
                        label='Password'
                        hint='8 or more characters with at least one uppercase, lowercase, digit, and special character'
                        placeholder='SLaR!1bar!fAS~'
                        value={ password.value }
                        onChange={ handleChange('password') }
                        withError
                        error={ password.error }
                        showError= { password.showError }
                        onBlur={ revealErrorOnBlur('password') }
                    />
                    <FormInput
                        type='password'
                        label='Confirm Password'
                        placeholder='SLaR!1bar!fAS~'
                        value={ passwordConfirmation.value }
                        onChange={ handleChange('passwordConfirmation') }
                        withError
                        error={ passwordConfirmation.error }
                        showError= { passwordConfirmation.showError }
                        onBlur={ revealErrorOnBlur('passwordConfirmation') }
                    />
                       
                    <FormSubmitRow>
                        <Button>Sign Up</Button>
                    </FormSubmitRow>

                </AuthForm>

                <GitHubLogin login={ login } />
            </>              
        );
    }
}

export default SignUpForm;