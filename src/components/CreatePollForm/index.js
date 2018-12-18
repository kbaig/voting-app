import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

import FormHeading from '../../primitives/FormHeading';
import FormInput from '../../primitives/FormInput';
import FormSubmitRow from '../../primitives/FormSubmitRow';
import Button from '../../primitives/Button';

import './CreatePollForm.sass';

class CreatePollForm extends Component {
    constructor () {
        super();

        this.state = {
            name: '',
            options: ['', '']
        };
    }

    handleNameChange = e => {
        this.setState({ name: e.target.value });
    }

    handleOptionChange = id => e => {
        const { value } = e.target ;
        this.setState(prevState => (
            { options: prevState.options.map((o, i) => i === id ? value : o) }
        ));
    }

    addOption = () => {
        this.setState(prevState => ({ options: [...prevState.options, ''] }));
    }

    removeOption = () => {
        // only remove if there are more than 2 options available
        this.setState(prevState => ({ options: prevState.options.length <= 2 ? prevState.options : prevState.options.slice(0, prevState.options.length - 1) }));
    }

    // TODO: front end validation
    handleSubmit = e => {
        e.preventDefault();
        let { name, options } = this.state;

        // trim name and option strings, and remove empty string options
        name = name.trim();        
        options = options.reduce((acc, option) => {
            const trimmedOption = option.trim();
            return trimmedOption.length > 0 ? [...acc, trimmedOption] : acc;
        }, []);
            
        // add poll only if name isn't empty string and there are at least 2 nonempty string options
        if (name !== '' && options.length >= 2) {
            const poll = { name, options };
            this.addPoll(poll);
        }   else {
            console.log(`Name field is empty: ${name === ''}
            Not enough valid options: ${options.length < 2}`);
        }
    }

    // TODO: redirect to the new poll, or some other relevant location
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

            if (response.ok) {
                const { poll } = await response.json();
                console.log({ poll });
            } else {
                const { error } = await response.json();
                console.log({ error });
            }
    
        } catch (error) {
            console.log({ error });
        }
    }

    render () {
        const { handleOptionChange, handleSubmit, handleNameChange, addOption, removeOption, state } = this;
        const { name, options } = state;
       
        const optionFields = options.map(
            (option, id) => <FormInput
                { ...(id === 0 ? { id: 'first-option' } : {}) }
                key={ id }
                type='text'
                placeholder={ id }
                value={ option }
                onChange={ handleOptionChange(id) }
            />
        );

        return (    
            <form className='CreatePollForm' onSubmit={ handleSubmit }>
                <FormHeading>Create A Poll</FormHeading>
        
                <FormInput label='Name' placeholder="What's your favorite number?" value={ name } onChange={ handleNameChange }/>
                <label className='Label' for='first-option'>Options</label>
                <div className='Options'>
                    { optionFields }
                    <Button onClick={ removeOption }><FontAwesomeIcon icon={ faMinus } /></Button>
                    <Button onClick={ addOption }><FontAwesomeIcon icon={ faPlus } /></Button>
                </div>
                
                <FormSubmitRow>
                    <Button>Create Poll</Button>
                </FormSubmitRow>
            </form>
        );
    }
}

export default CreatePollForm;