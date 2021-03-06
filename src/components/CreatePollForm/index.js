import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

import FormHeading from '../../primitives/FormHeading';
import FormInput from '../../primitives/FormInput';
import InputButton from '../../primitives/InputButton';
import FormSubmitRow from '../../primitives/FormSubmitRow';
import Button from '../../primitives/Button';

import './CreatePollForm.sass';

class CreatePollForm extends Component {
    constructor () {
        super();

        this.state = {
            form: {
                name: {
                    value: '',
                    error: null
                },
                options: {
                    value: ['', ''],
                    error: null
                }
            },
            redirect: null
        };
    }

    handleNameChange = e => {
        const { value } = e.target;

        this.setState(prevState => ({
            ...prevState,
            form: {
                ...prevState.form,
                name: {
                    ...prevState.form.name,
                    value,
                    error: null
                }
            }
        }));
    }

    handleOptionChange = id => e => {
        const { value } = e.target;

        this.setState(prevState => ({
            ...prevState,
            form: {
                ...prevState.form,
                options: {
                    ...prevState.form.options,
                    value: prevState.form.options.value.map((o, i) => i === id ? value : o),
                    error: null
                }
            }            
        }));
    }

    addOption = () => {
        this.setState(prevState => ({
            ...prevState,
            form: {
                ...prevState.form,
                options: {
                    ...prevState.form.options,
                    value: [...prevState.form.options.value, ''],
                    error: null
                }    
            }
        }));
    }

    removeOption = () => {
        // only remove if there are more than 2 options available
        if (this.state.form.options.value.length > 2) {
            this.setState(prevState => ({
                ...prevState,
                form: {
                    ...prevState.form,
                    options: {
                        ...prevState.form.options,
                        value: prevState.form.options.value.slice(0, prevState.form.options.value.length - 1),                            
                        error: null
                    }
                }
            }));
        }
        
    }

    // front end validation before submission
    handleSubmit = e => {
        e.preventDefault();
        let { name, options } = this.state.form;

        // trim name and option strings, and remove empty option fields
        name = name.value.trim();        
        options = options.value.reduce((acc, option) => {
            const trimmedOption = option.trim();
            return trimmedOption.length > 0 ? [...acc, trimmedOption] : acc;
        }, []);
            
        // add poll only if name isn't empty string and there are at least 2 nonempty string options
        const nameIsEmpty = name === '';
        const notEnoughOptions = options.length < 2;

        if (nameIsEmpty || notEnoughOptions) {
            this.setState(prevState => ({
                ...prevState,
                form: {
                    ...prevState.form,
                    name: {
                        ...prevState.form.name,
                        error: nameIsEmpty ? 'Enter a name' : null
                    },
                    options: {
                        ...prevState.form.options,
                        error: notEnoughOptions ? 'Enter at least 2 options' : null    
                    }
                }
            }));
        }   else {
            const poll = { name, options };
            this.addPoll(poll);
        }
    }

    addPoll = async newPoll => {
        try {
            const response = await fetch('http://localhost:3001/api/polls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.props.token}`
                },
                body: JSON.stringify(newPoll)
            });

            // redirect to poll if successful, handle errors if not
            if (response.ok) {
                const { poll } = await response.json();
                this.setState({ redirect: `/polls/${poll.id}` });
            } else {
                const { error } = await response.json();
                this.handleResponseError(response.status, error);
            }
    
        } catch (error) {
            this.props.flashError('Something went wrong. Please try again');
        }
    }    

    handleResponseError = (status, error) => {
        if (status === 500) return this.props.flashError('Something went wrong. Please try again');
        if (status === 401) return this.props.logout(); 
        if (status === 422) {
            return this.setState(prevState => {
                Object.keys(error).forEach(attr => {
                    prevState.form[attr] = {
                        ...prevState.form[attr],
                        error: error[attr]
                    };
                });

                return prevState;
            });
        }
    }

    render () {
        const { handleOptionChange, handleSubmit, handleNameChange, addOption, removeOption, state } = this;
        const { form, redirect } = state;
        const { name, options } = form;
       
        const optionFields = options.value.map(
            (option, id) => <input
                { ...(id === 0 ? { id: 'first-option' } : {}) }
                key={ id }
                placeholder={ id }
                value={ option }
                onChange={ handleOptionChange(id) }
                className={ `OptionInput${ options.error ? ' Invalid' : '' }` }
            />
        );

        return (redirect ? 
            <Redirect to={ redirect } push /> : 
            <form className='CreatePollForm' onSubmit={ handleSubmit }>
                    <FormHeading>Create A Poll</FormHeading>
            
                    <FormInput label='Name' placeholder="What's your favorite number?" value={ name.value } withError error={ name.error } showError onChange={ handleNameChange }/>

                    <label className='Label' htmlFor='first-option'>Options</label>
                    { options.error && <div className='Error'>{ options.error }</div> }
                    <div className='OptionFields'>
                        { optionFields }
                        <InputButton onClick={ removeOption }><FontAwesomeIcon icon={ faMinus } /></InputButton>
                        <InputButton onClick={ addOption }><FontAwesomeIcon icon={ faPlus } /></InputButton>
                    </div>                    
                    
                    <FormSubmitRow>
                        <Button>Create Poll</Button>
                    </FormSubmitRow>
            </form>
        );
    }
}

export default CreatePollForm;