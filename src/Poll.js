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
        const { name, options, match, vote } = this.props;
        return (
            <div>
                { name }
                <div>
                Options:
                    { options.map((o, i) => <div key={ i }>{ o.name }: { o.votes }</div>) }
                </div>
                <VoteForm options={ options.map(o => o.name) } pollId={ match.params.id } vote={ vote } />
            </div>
        );
    }
}

export default Poll;