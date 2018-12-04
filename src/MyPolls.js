import React, { Component } from 'react';

import MyPoll from './MyPoll';

class MyPolls extends Component {
    constructor () {
        super();

        this.state = { polls: [] };
    }

    async componentDidMount () {
        const { id } = this.props.user;
        try {
            const response = await fetch(`http://localhost:3001/api/polls/user/${id}`);

            if (response.ok) {
                const { polls } = await response.json();
                this.setState({ polls });
            } else {
                const { error } = await response.json();
                console.log({ error });
            }

        } catch (error) {
            console.log({ error });
        }
    }

    removePoll = async id => {
        try {
            const response = await fetch(`http://localhost:3001/api/polls/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${this.props.token}`}
            });

            if (response.ok) {
                const deletedPoll = await response.json();
                this.setState(prevState => ({
                    ...prevState,
                    polls: prevState.polls.filter(poll => poll._id !== deletedPoll._id)
                }));
            } else {
                const { error } = await response.json();
                console.log({ error });
            }
            
        } catch (error) {
            console.log({ error });
        }
    }

    render () {
        const polls = this.state.polls.map(poll => <MyPoll
            key={ poll.id }
            poll={ poll }
            removePoll={ () => this.removePoll(poll.id) }
         />);

        return (
            <div>
                { polls }
                <div>Soon I'll be able to see my polls' aggregate results.</div>
            </div>
        );
    }
}

export default MyPolls;