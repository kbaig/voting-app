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
            const polls = await response.json();
            this.setState({ polls });            
        } catch (error) {
            console.log(error);
        }
    }

    removePoll = async pollId => {
        console.log('poll id: ', pollId);
        try {
            const response = await fetch(`http://localhost:3001/api/polls/${pollId}`, { method: 'DELETE' });
            const deletedPoll = await response.json();
            this.setState(prevState => ({
                ...prevState,
                polls: prevState.polls.filter(poll => poll._id !== deletedPoll._id)
            }));
        } catch (error) {
            console.log(error);
        }
    }

    render () {
        const polls = this.state.polls.map(poll => <MyPoll
            key={ poll._id }
            poll={ poll }
            removePoll={ () => this.removePoll(poll._id) }
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