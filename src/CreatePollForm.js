import React, { Component } from 'react';

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

    handleOptionChange = (e, id) => {
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
            this.props.addPoll(poll);
        }   else {
            console.log(`Name field is empty: ${name === ''}
            Not enough valid options: ${options.length < 2}`);
        }
    }

    render () {
        const { options, name } = this.state;
        const { handleOptionChange, handleSubmit, handleNameChange, addOption, removeOption } = this;
       
        const optionFields = options.map(
            (o, id) => <input key={ id } type='text' name='options' value={ o } onChange={ e => handleOptionChange(e, id) }/>
        );

        return (
        <form onSubmit={ handleSubmit }>
            <h2>Add a poll</h2>
            <label>Name: <input type='text' name='name' value={ name } onChange={ handleNameChange }/></label>

            Options:
            { optionFields }
            <input type='button' onClick={ addOption } value='Add Option'></input>
            <input type='button' onClick={ removeOption } value='Remove Option'></input>
            <input type='submit' />
        </form>
        );
    }
}

export default CreatePollForm;