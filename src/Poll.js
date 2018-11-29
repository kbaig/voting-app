import React, { Component } from 'react';

import VoteForm from './VoteForm';
import AddOptionForm from './AddOptionForm';

class Poll extends Component {
    constructor () {
        super();

        this.state = { poll: null };
    }

    async componentDidMount () {
        try {
            const { id } = this.props.match.params;
            const response = await fetch(`http://localhost:3001/api/polls/${id}`);
            const poll = await response.json();
            this.setState({ poll });
        } catch (err) {
            console.log(err);
        }         
    }

    vote = async (optionId) => {
        const pollId = this.state.poll._id;
        try {
            const response = await fetch(`http://localhost:3001/api/polls/vote/${pollId}/${optionId}`, { method: 'POST' });
            const poll = await response.json();
            this.setState({ poll });
        } catch (err) {
            console.log(err);
        }
    }

    addOption = async option => {
        const { _id } = this.state.poll;
        try {
            const response = await fetch(`http://localhost:3001/api/polls/add-option/${_id}?option=${option}`, { method: 'POST' });
            const poll = await response.json();
            this.setState({ poll });
        } catch (err) {
            console.log(err);
        }
    }

    render () {
        const { poll } = this.state;
        const { isAuthenticated } = this.props;
        const { vote, addOption } = this;        

        return (!!poll && 
            <div>
                { poll.name }
                <div>
                    Options:
                    { poll.options.map(o => <div key={ o._id }>{ o.name }: { o.votes }</div>) }
                </div>
                <VoteForm options={ poll.options } pollId={ poll._id } vote={ vote } />
                { isAuthenticated && <AddOptionForm addOption={ addOption } /> }
            </div>
        );
    }
}

export default Poll;