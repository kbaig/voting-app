import React, { Component } from 'react';

import GitHubLogin from '../GitHubLogin';

import AuthForm from '../../primitives/AuthForm';
import FormHeading from '../../primitives/FormHeading';
import FormInput from '../../primitives/FormInput';
import FormSubmitRow from '../../primitives/FormSubmitRow';
import Button from '../../primitives/Button';

import validate from './validate';

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
            },
            errors: {
                name: null,
                email: null,
                username: null,
                password: null,
                passwordConfirmation: null
            }
        };
    }

    validate = attr => e => {
        const error = validate(attr, this.state.form);        

        this.setState(prevState => ({
            ...prevState,
            errors: {
                ...prevState.errors,
                [attr]: error
            }
        }));
    }

    handleChange = attr => e => {
        const { value } = e.target;

        console.log(value);

        this.setState(prevState => ({
            ...prevState,
            form: {
                ...prevState.form,
                [attr]: value
            }
        }));
    }

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
        const { validate, handleChange, handleSubmit, state, props } = this;
        const { form, errors } = state;
        const { login } = props;
        const { name, email, username, password, passwordConfirmation } = form;
        
        return (
            <>
                <AuthForm onSubmit={ handleSubmit }>
                    <FormHeading>Sign Up</FormHeading>
           
                    <FormInput label='Name' placeholder='Ford Prefect' focus value={ name } onChange={ handleChange('name') } onBlur={ validate('name') } error={ errors.name } />
                    <FormInput label='Email' type='email' placeholder='ford@example.com' value={ email } onChange={ handleChange('email') } onBlur={ validate('email') } error={ errors.email }/>
                    <FormInput label='Username' placeholder='fprefect' value={ username } onChange={ handleChange('username') } onBlur={ validate('username') } error={ errors.username } />
                    <FormInput label='Password' type='password' placeholder='SLaR!1bar!fAS~' value={ password } onChange={ handleChange('password') } onBlur={ validate('password') }  error={ errors.password } />
                    <FormInput label='Confirm Password' type='password' placeholder='SLaR!1bar!fAS~' value={ passwordConfirmation } onChange={ handleChange('passwordConfirmation') } onBlur={ validate('passwordConfirmation') } error={ errors.passwordConfirmation } />
                       
                    <FormSubmitRow>
                        <Button type='Submit' value='Sign Up' readOnly/>
                    </FormSubmitRow>
                </AuthForm>
                <GitHubLogin login={ login } />
            </>              
        );
    }
}

export default SignUpForm;