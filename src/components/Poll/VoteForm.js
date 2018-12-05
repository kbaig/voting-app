import React, {Component } from 'react';

class VoteForm extends Component {
    constructor (props) {
        super(props);

        this.state = {
            optionId: props.options[0].id
        };
    }

    handleChange = e => {
        this.setState({ optionId: e.target.value });
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.vote(this.state.optionId);
    }

    render () {
        const { optionId } = this.state;
        const { handleChange, handleSubmit } = this;
        const { options } = this.props;
        return (
            <form onSubmit={ handleSubmit }>
                <select value={ optionId } onChange={ handleChange }>
                    { options.map(o => <option key={ o.id } value={ o.id }>{ o.name }</option>) }
                </select>
                <input type='submit' />
            </form>
        );
    }
}

export default VoteForm;