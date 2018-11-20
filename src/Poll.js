// todo: fix bug where voting does nothing when navigating directly from one poll to another

import React, { Component } from 'react';

import VoteForm from './VoteForm';

class Poll extends Component {

    // update poll on mount to ensure most up to date version of poll
    async componentDidMount () {
        try {
            const { id } = this.props.match.params;
            const response = await fetch(`http://localhost:3001/api/polls/${id}`);
            const poll = await response.json();
            this.props.updatePoll(id, poll);
        } catch (err) {
            console.log(err);
        }         
    }

    render () {
        const { poll, vote } = this.props;
        const { _id, name, options } = poll;
        
        return (
            <div>
                { name }
                <div>
                    Options:
                    { options.map(o => <div key={ o._id }>{ o.name }: { o.votes }</div>) }
                </div>
                <VoteForm options={ options } pollId={ _id } vote={ vote } />
            </div>
        );
    }
}

export default Poll;