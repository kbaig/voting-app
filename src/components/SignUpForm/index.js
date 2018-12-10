import React, { Component } from 'react';

import GitHubLogin from '../GitHubLogin';

import Form from '../../primitives/Form';
import FormHeading from '../../primitives/FormHeading';
import FormFields from '../../primitives/FormFields';
import FormInput from '../../primitives/FormInput';
import FormSubmitRow from '../../primitives/FormSubmitRow';
import Button from '../../primitives/Button';

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
        const { handleChange, handleSubmit, state, props } = this;
        const { form } = state;
        const { login } = props;
        const { name, email, username, password, passwordConfirmation } = form;
        
        return (
            <>
                <Form onSubmit={ handleSubmit }>
                    <FormHeading>Sign Up</FormHeading>
                    <FormFields>
                        <FormInput type='text' placeholder='Name' focus value={ name } onChange={ e => handleChange('name', e) } />
                        <FormInput type='email' placeholder='Email' value={ email } onChange={ e => handleChange('email', e) } />
                        <FormInput type='text' placeholder='Username' value={ username } onChange={ e => handleChange('username', e) } />
                        <FormInput type='password' placeholder='Password' value={ password } onChange={ e => handleChange('password', e) } />
                        <FormInput type='password' placeholder='Confirm Password' value={ passwordConfirmation } onChange={ e => handleChange('passwordConfirmation', e) } />
                    </FormFields>              
                    <FormSubmitRow>
                        <Button type='Submit' value='Sign Up' readOnly/>
                    </FormSubmitRow>
                </Form>
                <GitHubLogin login={ login } />
            </>              
        );
    }
}

export default SignUpForm;