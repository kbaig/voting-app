import React, {Component } from 'react';

class VoteForm extends Component {
    constructor () {
        super();

        this.state = {
            optionId: 0
        };
    }

    handleSubmit = e => {
        console.log('world')
        e.preventDefault();
        this.props.vote(this.props.pollId, this.state.optionId);
    }

    handleChange = e => {
        this.setState({ optionId: e.target.value });
    }

    render () {
        return (
            <form onSubmit={ this.handleSubmit }>
                <select value={ this.state.optionId } onChange={ this.handleChange }>
                    { this.props.options.map((o, i) => <option key={ i } value={ i }>{ o }</option>) }
                </select>
                <input type='submit' />
            </form>
        );
    }
}

export default VoteForm;