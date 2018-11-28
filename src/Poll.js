import React, { Component } from 'react';

import VoteForm from './VoteForm';

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

    render () {
        const { poll } = this.state;

        const vote = this.vote;
        const { isAuthenticated } = this.props;

        return (!!poll && 
            <div>
                { poll.name }
                <div>
                    Options:
                    { poll.options.map(o => <div key={ o._id }>{ o.name }: { o.votes }</div>) }
                </div>
                <VoteForm options={ poll.options } pollId={ poll._id } vote={ vote } />
                { `I can${isAuthenticated ? '' : 'not'} add options since I am ${isAuthenticated ? '' : 'not'} authenticated` }
            </div>
        );
    }
}

export default Poll;