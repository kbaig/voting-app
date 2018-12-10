import React, { Component } from 'react';

import PollPie from './PollPie';
import VoteForm from './VoteForm';
import AddOptionForm from './AddOptionForm';

import './Poll.sass';

class Poll extends Component {
    constructor () {
        super();

        this.state = { poll: null };
    }

    async componentDidMount () {
        try {
            const { id } = this.props.match.params;
            const response = await fetch(`http://localhost:3001/api/polls/${id}`);
            const { error, poll } = await response.json();
            if (error) {
                console.log({ error });
            } else {
                console.log(poll);
                this.setState({ poll });
            }
        } catch (error) {
            console.log({ error });
        }
    }

    vote = async (optionId) => {
        const pollId = this.state.poll.id;
        try {
            const response = await fetch(`http://localhost:3001/api/polls/vote/${pollId}/${optionId}`, {
                method: 'POST'
            });
            
            if (response.ok) {
                const { poll } = await response.json();
                this.setState({ poll });
            } else {
                const { error } = await response.json();
                console.log({ error });
            }

        } catch (error) {
            console.log({ error });
        }
    }

    addOption = async option => {
        const { id } = this.state.poll;
        try {
            const response = await fetch(`http://localhost:3001/api/polls/add-option/${id}?option=${option}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${this.props.token}`}
            });

            if (response.ok) {
                const { poll } = await response.json();
                this.setState({ poll });
            } else {
                const { error } = await response.json();
                console.log({ error });
            }
            
        } catch (error) {
            console.log({ error });
        }
    }

    render () {
        const { state, props, vote, addOption } = this;
        const { poll } = state;
        const { isAuthenticated } = props;
        

        return (!!poll && 
            <>
                <h1>{ poll.name }</h1>
                <div className='PollContent'>
                    <div className='PollForms'>
                        <VoteForm options={ poll.options } pollId={ poll.id } vote={ vote } />
                        { isAuthenticated && <AddOptionForm addOption={ addOption } /> }
                    </div>
                    <PollPie options={ poll.options } />
                </div>
                
            </>
        );
    }
}

export default Poll;