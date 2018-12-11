import React, { Component } from 'react';

import AuthForm from '../../primitives/AuthForm';
import FormHeading from '../../primitives/FormHeading';
import FormFields from '../../primitives/FormFields';
import FormInput from '../../primitives/FormInput';
import FormSubmitRow from '../../primitives/FormSubmitRow';
import Button from '../../primitives/Button';

// const validation = {
//     username: {
//         minLength: 4,
//         maxLength: 15,
//         required: true
//     },
//     password: {
//         minLength: 8,
//         required: true
//     }
    
// };

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

    handleChange = attr => e => {
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
                console.log({ token })
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
        const { handleChange, handleSubmit, state } = this;
        const { form } = state;
        const { username, password } = form;
        
        return (
            <AuthForm onSubmit={ handleSubmit }>
                <FormHeading>Log In</FormHeading>
                <FormFields>
                    <FormInput type='text' placeholder='Username' focus value={ username } onChange={ handleChange('username') } />
                    <FormInput type='password' placeholder='Password' value={ password } onChange={ handleChange('password') } />
                </FormFields>
                <FormSubmitRow>
                    <Button type='submit' value='Log In' readOnly />
                </FormSubmitRow>
            </AuthForm>
        );
    }
}

export default BasicLogin;