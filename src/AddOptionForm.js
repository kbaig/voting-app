import React, { Component } from 'react';

class AddOptionForm extends Component {
    constructor () {
        super();

        this.state = { option: '' };
    }

    handleChange = e => {
        const option = e.target.value;
        this.setState({ option });
    }

    handleSubmit = e => {
        e.preventDefault();
        const option = this.state.option.trim();

        if (option.length === 0) {
            console.log({ error: `an empty string won't work!` });
        } else {
            this.props.addOption(option);
        }
    }

    render () {
        const { option } = this.state;
        const { handleChange, handleSubmit } = this;
        return (
            <form onSubmit={ handleSubmit }>
                Add an option:
                <input type='text' value={ option } onChange={ handleChange } />
                <input type='submit' />
            </form>
        );
    }
}

export default AddOptionForm;