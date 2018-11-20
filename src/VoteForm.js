import React, {Component } from 'react';

class VoteForm extends Component {
    constructor (props) {
        super(props);

        this.state = {
            optionId: props.options[0]._id
        };
    }

    handleChange = e => {
        this.setState({ optionId: e.target.value });
    }

    handleSubmit = e => {
        e.preventDefault();
        console.log(this.props.pollId, this.state.optionId);
        this.props.vote(this.props.pollId, this.state.optionId);
    }

    render () {
        return (
            <form onSubmit={ this.handleSubmit }>
                <select value={ this.state.optionId } onChange={ this.handleChange }>
                    { this.props.options.map(o => <option key={ o._id } value={ o._id }>{ o.name }</option>) }
                </select>
                <input type='submit' />
            </form>
        );
    }
}

export default VoteForm;